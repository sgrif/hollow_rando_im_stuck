use crate::logic::{self, Condition};

#[derive(Debug, Clone, serde::Deserialize)]
pub(crate) struct RawSpoiler {
    #[serde(rename = "LM")]
    pub logic_manager: RawLogicManager,
    #[serde(rename = "itemPlacements")]
    pub items: Vec<ItemPlacement>,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct RawLogicManager {
    #[serde(rename = "Logic")]
    pub logic: Vec<Logic>,
}

#[derive(PartialEq, Eq, Hash, Debug, Clone, serde::Deserialize)]
pub struct Logic {
    #[serde(alias = "Name")]
    pub name: String,
    #[serde(alias = "Logic")]
    pub logic: Condition,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct ItemPlacement {
    #[serde(rename = "Item")]
    pub item: ItemContainer,
    #[serde(rename = "Location")]
    pub location: Location,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct ItemContainer {
    #[serde(rename = "item")]
    pub inner: Item,
}

#[derive(PartialEq, Eq, Hash, Debug, Clone, serde::Deserialize)]
pub struct Item {
    #[serde(rename = "Name")]
    pub name: String,
    #[serde(flatten)]
    pub effects: Effects,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct Location {
    #[serde(rename = "LocationDef")]
    pub def: LocationDef,
    pub costs: Option<Vec<Cost>>,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct LocationDef {
    #[serde(rename = "Name")]
    pub name: String,
}

#[derive(PartialEq, Eq, Hash, Debug, Clone, serde::Deserialize)]
#[serde(untagged)]
pub enum Effects {
    #[serde(rename_all = "PascalCase")]
    Single {
        effect: Effect,
    },
    #[serde(rename_all = "PascalCase")]
    Multiple {
        effects: Vec<Effect>,
    },
    #[serde(rename_all = "PascalCase")]
    MultiItem {
        logic: Logic,
        true_item: Box<Item>,
        false_item: Box<Item>,
    },
    // For some reason we can't use #[serde(other)] here
    None {},
}

impl Effects {
    pub(crate) fn apply(&self, lm: &mut logic::Manager) {
        self.for_each_effect(lm, |effect, lm| effect.apply(lm))
    }

    pub(crate) fn apply_only(&self, term: &str, lm: &mut logic::Manager) {
        self.for_each_effect(lm, |effect, lm| {
            if effect.term == term {
                effect.apply(lm)
            }
        })
    }

    fn for_each_effect(&self, lm: &mut logic::Manager, f: impl Fn(&Effect, &mut logic::Manager)) {
        match self {
            Self::Single { effect } => f(effect, lm),
            Self::Multiple { effects } => {
                for effect in effects {
                    f(effect, lm)
                }
            }
            Self::MultiItem {
                logic,
                true_item,
                false_item,
            } => {
                if logic.logic.is_met(lm) {
                    true_item.effects.for_each_effect(lm, f)
                } else {
                    false_item.effects.for_each_effect(lm, f)
                }
            }
            Self::None {} => {} // do nothing
        }
    }
}

#[derive(PartialEq, Eq, Hash, Debug, Clone, serde::Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct Effect {
    pub term: String,
    pub value: i32,
}

impl Effect {
    fn apply(&self, lm: &mut logic::Manager) {
        lm.acquire(&self.term, self.value)
    }
}

#[derive(PartialEq, Eq, Hash, Debug, Clone, serde::Deserialize)]
#[serde(untagged)]
pub enum Cost {
    Term { term: String, threshold: i32 },
    Geo {},
}

impl Cost {
    pub(crate) fn is_met(&self, lm: &logic::Manager) -> bool {
        match self {
            Self::Term { term, threshold } => lm.acquired_amount(&term) >= *threshold,
            Self::Geo {} => true, // FIXME: Check replenish geo waypoint?
        }
    }

    pub(crate) fn term(&self) -> Option<&str> {
        match self {
            Self::Term { term, .. } => Some(term),
            Self::Geo {} => None,
        }
    }
}
