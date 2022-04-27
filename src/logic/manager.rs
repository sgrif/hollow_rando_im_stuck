use super::Condition;
use crate::spoiler_log::{Cost, Effects, RawSpoiler};
use itertools::Itertools;
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

#[cfg(test)]
use crate::spoiler_log::Effect;

#[derive(Clone)]
pub struct Manager {
    locations: Rc<HashMap<String, Condition>>,
    items: Rc<HashMap<String, Vec<Item>>>,
    acquired: HashMap<String, i32>,
}

impl Manager {
    pub(crate) fn new(spoiler: RawSpoiler, mut acquired: HashMap<String, i32>) -> Self {
        let locations = spoiler
            .logic_manager
            .logic
            .into_iter()
            .map(|l| (l.name, l.logic))
            .collect();
        let items = spoiler
            .items
            .into_iter()
            .map(|placement| {
                let key = placement.location.def.name;
                let value = Item {
                    name: placement.item.inner.name,
                    effects: placement.item.inner.effects,
                    costs: placement.location.costs.unwrap_or_default(),
                };
                (key, value)
            })
            .into_group_map();

        // Randomized costs have their inital value set to 0 - tolerance setting. We need to adjust
        // for that to get the real number of acquired items.
        let negative_initial_costs = spoiler
            .initial_progression
            .setters
            .iter()
            .filter(|effect| effect.value.is_negative());
        for cost in negative_initial_costs {
            if let Some(value) = acquired.get_mut(&cost.term) {
                *value -= cost.value;
            }
        }
        Self {
            locations: Rc::new(locations),
            items: Rc::new(items),
            acquired,
        }
    }

    pub(crate) fn reachable_key_items(&self) -> Vec<KeyItem> {
        let reachable_locations = self.reachable_locations().collect::<HashSet<_>>();
        let affordable_items = self.affordable_items().collect::<HashSet<_>>();
        affordable_items
            .iter()
            .filter_map(|(location, item)| {
                let mut copy = self.clone();
                item.effects.apply(&mut copy);
                let new_locations = copy.reachable_locations().collect();
                let new_items = copy.affordable_items().collect();
                if reachable_locations.is_superset(&new_locations)
                    && affordable_items.is_superset(&new_items)
                {
                    None
                } else {
                    Some(KeyItem {
                        item: item.name.clone(),
                        location: location.to_string(),
                        unlocked_locations: new_locations
                            .difference(&reachable_locations)
                            .map(|s| s.to_string())
                            .collect(),
                        unlocked_items: new_items
                            .difference(&affordable_items)
                            .map(|(location, item)| UnlockedItem {
                                location: location.to_string(),
                                name: item.name.clone(),
                            })
                            .collect(),
                    })
                }
            })
            .collect()
    }

    pub(crate) fn acquired_amount(&self, name: &str) -> i32 {
        self.acquired.get(name).copied().unwrap_or_default()
    }

    pub(crate) fn acquire(&mut self, term: &str, amt: i32) {
        let entry = self.acquired.entry(term.to_string()).or_default();
        *entry += amt;
    }

    fn reachable_items(&self) -> impl Iterator<Item = (&str, &Item)> {
        self.reachable_locations()
            .flat_map(move |location| self.items_at(location).iter().map(move |l| (location, l)))
    }

    fn affordable_items(&self) -> impl Iterator<Item = (&str, &Item)> {
        self.reachable_items()
            .filter(move |(_, item)| item.costs.iter().all(|cost| cost.is_met(self)))
    }

    fn reachable_locations(&self) -> impl Iterator<Item = &str> {
        self.locations
            .iter()
            .filter(move |(location, condition)| {
                !self.already_unlocked(location) && condition.is_met(self)
            })
            .map(|(k, _)| &**k)
    }

    fn items_at(&self, location: &str) -> &[Item] {
        self.items
            .get(location)
            .map(|v| v.as_slice())
            .unwrap_or(&[])
    }

    fn already_unlocked(&self, item: &str) -> bool {
        self.acquired_amount(item) != 0
    }
}

#[derive(PartialEq, Eq, Hash, Debug, Clone)]
pub struct Item {
    name: String,
    effects: Effects,
    costs: Vec<Cost>,
}

#[derive(PartialEq, Eq, Debug)]
pub struct KeyItem {
    pub(crate) item: String,
    pub(crate) location: String,
    pub(crate) unlocked_locations: Vec<String>,
    pub(crate) unlocked_items: Vec<UnlockedItem>,
}

#[derive(PartialEq, Eq, Debug)]
pub struct UnlockedItem {
    pub location: String,
    pub name: String,
}

#[test]
fn unaffordable_costs() {
    let mut locations = HashMap::new();
    locations.insert(
        "Grubfather".into(),
        Condition::GreaterThan("Crossroads_38[right1]".into(), 0),
    );
    locations.insert(
        "Important place".into(),
        Condition::GreaterThan("New place".into(), 0),
    );
    let mut items = HashMap::new();
    items.insert(
        "Grubfather".into(),
        vec![Item {
            name: "Very Important".into(),
            effects: Effects::Single {
                effect: Effect {
                    term: "New place".into(),
                    value: 1,
                },
            },
            costs: vec![Cost::Term {
                term: "GRUBS".into(),
                value: 1,
            }],
        }],
    );
    let mut acquired = HashMap::new();
    acquired.insert("Crossroads_38[right1]".into(), 1);
    let mut manager = Manager {
        locations: Rc::new(locations),
        items: Rc::new(items),
        acquired,
    };

    assert_eq!(0, manager.affordable_items().count());
    assert_eq!(0, manager.reachable_key_items().len());

    Rc::get_mut(&mut manager.items)
        .unwrap()
        .get_mut("Grubfather")
        .unwrap()
        .push(Item {
            name: "A Grub".into(),
            effects: Effects::Single {
                effect: Effect {
                    term: "GRUBS".into(),
                    value: 1,
                },
            },
            costs: Vec::new(),
        });

    assert_eq!(
        vec!["A Grub".to_string()],
        manager
            .reachable_key_items()
            .into_iter()
            .map(|item| item.item)
            .collect_vec()
    );
}
