use rustc_hash::FxHashSet as HashSet;

#[derive(Debug, Clone, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct TrackerData {
    pub obtained_items: HashSet<u16>,
}
