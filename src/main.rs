use clap::Parser;
use std::error::Error;
use std::fs::File;
use std::io::BufReader;
use std::path::{Path, PathBuf};
use std::process::exit;

pub(crate) mod logic;
pub(crate) mod spoiler_log;

#[derive(Parser)]
struct Cli {
    /// The path to the directory containing your Randomizer spoiler logs. For example,
    /// "%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight\Randomizer 4\user1"
    path: PathBuf,
    /// When enabled, lists the locations unlocked by each item, rather than only showing a count
    #[clap(long)]
    show_unlocked_locations: bool,
    /// When enabled, shows the name of the item at each location.
    #[clap(long)]
    show_items: bool,
}

fn main() {
    if let Err(e) = try_main() {
        eprintln!("{}", e);
        exit(1)
    }
}

fn try_main() -> Result<(), Box<dyn Error>> {
    let cli = Cli::parse();
    let spoiler_path = cli.path.join("RawSpoiler.json");
    let tracker_path = cli.path.join("TrackerDataWithoutSequenceBreaksPM.txt");
    let logic_manager =
        logic::Manager::new(deserialize(&spoiler_path)?, deserialize(&tracker_path)?);

    let key_items = logic_manager.reachable_key_items();
    if key_items.is_empty() {
        println!("Oh no, we couldn't find any single pickup that unlocks new locations. \
            This most likely means your save has an edge case we haven't handled yet. \
            sgrif#3891 in Discord would appreciate a ping.");
    }

    for key_item in key_items {
        print!("Getting ");
        if cli.show_items {
            print!("{}", key_item.item);
        } else {
            print!("the item");
        }
        print!(" at {} will unlock", key_item.location);
        if cli.show_unlocked_locations {
            println!(":");
            for location in key_item.unlocked_locations {
                println!("- {}", location);
            }
        } else {
            print!(" {} locations", key_item.unlocked_locations.len());
        }
    }

    Ok(())
}

fn deserialize<T: serde::de::DeserializeOwned>(path: &Path) -> Result<T, Box<dyn Error>> {
    let mut file = BufReader::new(File::open(&path)?);
    Ok(serde_jsonrc::from_reader(&mut file)?)
}
