use crate::logic::Condition;

#[derive(Debug, Clone, serde::Deserialize)]
pub(crate) struct RawSpoiler {
    #[serde(rename = "LM")]
    pub logic_manager: RawLogicManager,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct RawLogicManager {
    #[serde(rename = "Logic")]
    pub logic: Vec<RawLogic>,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct RawLogic {
    name: String,
    logic: Condition,
}
