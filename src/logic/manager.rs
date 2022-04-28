use super::Condition;
use crate::spoiler_log::{Cost, Effects, RawSpoiler};
use itertools::Itertools;
use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::rc::Rc;

#[cfg(test)]
use crate::spoiler_log::Effect;

#[derive(Clone)]
pub struct Manager {
    locations: Rc<HashMap<String, Condition>>,
    items: Rc<HashMap<String, Vec<Item>>>,
    transitions: Rc<HashMap<String, String>>,
    acquired: HashMap<String, i32>,
}

impl Manager {
    pub(crate) fn new(
        spoiler: RawSpoiler,
        collected: Vec<(String, String)>,
    ) -> Result<Self, Box<dyn Error>> {
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
        let transitions = spoiler
            .transitions
            .unwrap_or_default()
            .into_iter()
            .map(|placement| (placement.source.name, placement.target.name))
            .collect();

        let mut acquired = HashMap::new();
        acquired.insert("TRUE".into(), 1);
        for setter in spoiler.initial_progression.setters {
            acquired.insert(setter.term, setter.value);
        }

        let mut result = Self {
            locations: Rc::new(locations),
            items: Rc::new(items),
            transitions: Rc::new(transitions),
            acquired,
        };

        for (item_name, location) in collected {
            if let Some(item) = result.find_item(Some(&location), |item| item.name == item_name) {
                item.effects.clone().apply(&mut result);
            } else if !item_name.starts_with("100_Geo-") {
                let item = result
                    .find_item(None, |item| item.name == item_name)
                    .ok_or_else(|| {
                        format!(
                            "Tracker Log indicated {} was picked up, but no item with that name was found",
                            item_name
                        )
                    })?;
                result
                    .find_item(Some(&location), |other| {
                        item.effects.has_same_effect_as(&other.effects)
                    })
                    .ok_or_else(|| {
                        format!(
                            "Could not find an item at {} with the same effects as {}",
                            location, item_name
                        )
                    })?
                    .effects
                    .clone()
                    .apply(&mut result);
            }
        }

        result.unlock_location(spoiler.start_def.transition);
        result.unlock_all_reachable_locations();

        Ok(result)
    }

    pub(crate) fn reachable_key_items(&self) -> Vec<KeyItem> {
        let reachable_locations = self.reachable_locations().collect::<HashSet<_>>();
        self.affordable_items()
            .filter_map(|(location, item)| {
                let mut copy = self.clone();
                item.effects.apply(&mut copy);
                let new_locations = copy.reachable_locations().collect();
                if reachable_locations.is_superset(&new_locations) {
                    None
                } else {
                    Some(KeyItem {
                        item: item.name.clone(),
                        location: location.to_string(),
                        unlocked_locations: new_locations
                            .difference(&reachable_locations)
                            .map(|s| s.to_string())
                            .collect(),
                    })
                }
            })
            .collect()
    }

    pub(crate) fn reachable_cost_unlocks(&self) -> Vec<CostUnlock> {
        let affordable_items = self.affordable_items().collect::<HashSet<_>>();
        let cost_terms = self
            .reachable_items()
            .flat_map(|(_, item)| &item.costs)
            .filter_map(|cost| cost.term())
            .collect::<HashSet<_>>();

        cost_terms
            .into_iter()
            .flat_map(|term| {
                let mut copy = self.clone();
                copy.acquired.remove(term);
                for (_, item) in &affordable_items {
                    item.effects.apply_only(term, &mut copy);
                }
                copy.affordable_items()
                    .filter(|item| !affordable_items.contains(item))
                    .into_group_map()
                    .into_iter()
                    .map(|(location, unlocks)| CostUnlock {
                        term: term.to_string(),
                        location: location.to_string(),
                        count: unlocks.len(),
                    })
                    .collect_vec()
            })
            .collect()
    }

    pub(crate) fn acquired_amount(&self, name: &str) -> i32 {
        self.acquired.get(name).copied().unwrap_or_default()
    }

    pub(crate) fn acquire(&mut self, term: String, amt: i32) {
        let entry = self.acquired.entry(term).or_default();
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

    /// Returns the first reachable location that has no items, meaning it is
    /// either a waypoint or a transition
    fn next_reachable_location(&self) -> Option<&str> {
        self.reachable_locations()
            .find(|loc| self.items_at(loc).is_empty())
    }

    /// Marks all reachable transitions or waypoints as acquired
    fn unlock_all_reachable_locations(&mut self) {
        while let Some(loc) = self.next_reachable_location() {
            let loc = loc.into();
            self.unlock_location(loc);
        }
    }

    fn unlock_location(&mut self, location: String) {
        if let Some(connected) = self.transitions.get(&location).cloned() {
            self.acquire(connected, 1);
        } else if let Some(connected) = super::vanilla_transitions::TRANSITIONS.get(&location) {
            self.acquire(connected.to_string(), 1);
        }
        self.acquire(location, 1);
    }

    fn find_item(
        &self,
        location: Option<&str>,
        pattern: impl FnMut(&&Item) -> bool,
    ) -> Option<&Item> {
        if let Some(location) = location {
            self.items_at(location).iter().find(pattern)
        } else {
            self.items.values().flatten().find(pattern)
        }
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
}

#[derive(PartialEq, Eq, Debug)]
pub struct CostUnlock {
    pub(crate) term: String,
    pub(crate) location: String,
    pub(crate) count: usize,
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
    locations.insert(
        "More important place".into(),
        Condition::GreaterThan("Newer place".into(), 0),
    );
    let mut items = HashMap::new();
    items.insert(
        "Grubfather".into(),
        vec![
            Item {
                name: "Very Important".into(),
                effects: Effects::Single {
                    effect: Effect {
                        term: "New place".into(),
                        value: 1,
                    },
                },
                costs: vec![Cost::Term {
                    term: "GRUBS".into(),
                    threshold: 1,
                }],
            },
            Item {
                name: "So Important".into(),
                effects: Effects::Single {
                    effect: Effect {
                        term: "Newer place".into(),
                        value: 1,
                    },
                },
                costs: vec![Cost::Term {
                    term: "GRUBS".into(),
                    threshold: 2,
                }],
            },
        ],
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

    // 0 grubs collected, 1 reachable grub
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
        vec![CostUnlock {
            term: "GRUBS".into(),
            location: "Grubfather".into(),
            count: 1,
        }],
        manager.reachable_cost_unlocks(),
    );

    // 1 grub collected, 1 reachable grub
    manager.acquired.insert("GRUBS".into(), 1);

    assert_eq!(2, manager.affordable_items().count());
    assert_eq!(1, manager.reachable_key_items().len());
    assert_eq!(0, manager.reachable_cost_unlocks().len());
}
