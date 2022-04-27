use wasm_bindgen::prelude::*;
use hollow_rando_im_stuck::Settings;
use std::str;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn run(
    raw_spoiler: &[u8],
    tracker_data: &[u8],
    show_items: bool,
    show_unlocked_locations: bool,
) -> Option<String> {
    let settings = Settings {
        raw_spoiler,
        tracker_data,
        show_items,
        show_unlocked_locations,
    };
    let mut output = Vec::new();
    if let Err(e) = hollow_rando_im_stuck::run(&mut output, settings) {
        alert(&e.to_string());
        None
    } else {
        String::from_utf8(output).ok()
    }
}
