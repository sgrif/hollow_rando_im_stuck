use std::env::args_os;
use std::error::Error;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use std::process::exit;

pub(crate) mod logic;
pub(crate) mod spoiler_log;

fn main() {
    if let Err(e) = try_main() {
        eprintln!("{}", e);
        exit(1)
    }
}

fn try_main() -> Result<(), Box<dyn Error>> {
    let args = args_os().skip(1).collect::<Vec<_>>();
    assert_eq!(args.len(), 1, "expected a single argument");
    let path = Path::new(&args[0]);
    let spoiler_path = path.join("RawSpoiler.json");
    let tracker_path = path.join("TrackerDataWithoutSequenceBreaksPM.txt");
    let logic_manager =
        logic::Manager::new(deserialize(&spoiler_path)?, deserialize(&tracker_path)?);

    let key_items = logic_manager.reachable_key_items();
    if key_items.is_empty() {
        println!("Oh no, we couldn't find any single pickup that unlocks new locations.");
        println!("This most likely means your save has an edge case we haven't handeld yet.");
        println!("sgrif#3891 in Discord would appreciate a ping");
    }

    for key_item in key_items {
        println!(
            "Getting {} at {} will unlock:",
            key_item.item, key_item.location
        );
        for location in key_item.unlocked_locations {
            println!("- {}", location);
        }
    }

    Ok(())
}

fn deserialize<T: serde::de::DeserializeOwned>(path: &Path) -> Result<T, Box<dyn Error>> {
    let mut file = BufReader::new(File::open(&path)?);
    Ok(serde_jsonrc::from_reader(&mut file)?)
}
