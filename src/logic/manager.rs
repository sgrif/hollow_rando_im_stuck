use super::Condition;
use crate::spoiler_log::{Item, RawSpoiler};
use itertools::Itertools;
use std::collections::{HashMap, HashSet};
use std::rc::Rc;

#[derive(Clone)]
pub struct Manager {
    pub locations: Rc<HashMap<String, Condition>>,
    items: Rc<HashMap<String, Vec<Item>>>,
    acquired: HashMap<String, i32>,
}

impl Manager {
    pub(crate) fn new(spoiler: RawSpoiler, acquired: HashMap<String, i32>) -> Self {
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
                let value = placement.item.inner;
                (key, value)
            })
            .into_group_map();
        Self {
            locations: Rc::new(locations),
            items: Rc::new(items),
            acquired,
        }
    }

    pub(crate) fn reachable_key_items(&self) -> Vec<KeyItem> {
        let reachable_locations = self.reachable_locations().collect::<HashSet<_>>();
        reachable_locations
            .iter()
            .flat_map(|location| self.items_at(location).iter().map(move |l| (location, l)))
            .filter_map(|(location, item)| {
                let mut copy = self.clone();
                item.effects.apply(&mut copy);
                let new_locations = copy.reachable_locations().collect::<HashSet<_>>();
                if new_locations.is_subset(&reachable_locations) {
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

    pub(crate) fn acquired_amount(&self, name: &str) -> i32 {
        self.acquired.get(name).copied().unwrap_or_default()
    }

    pub(crate) fn acquire(&mut self, term: &str, amt: i32) {
        let entry = self.acquired.entry(term.to_string()).or_default();
        *entry += amt;
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

pub struct KeyItem {
    pub(crate) item: String,
    pub(crate) location: String,
    pub(crate) unlocked_locations: Vec<String>,
}
