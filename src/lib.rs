use std::collections::HashSet;
use std::error::Error;
use std::io::prelude::*;
use std::io::BufReader;

pub(crate) mod logic;
pub(crate) mod spoiler_log;

pub struct Settings<T: Read> {
    /// A handle to read `RawSpoiler.json`
    pub raw_spoiler: T,
    /// A handle to read `TrackerLog.txt`
    pub tracker_log: T,
    /// When enabled, lists the locations unlocked by each item, rather than only showing a count
    pub show_unlocked_locations: bool,
    /// When enabled, shows the name of the item at each location.
    pub show_items: bool,
}

pub fn run(output: &mut impl Write, settings: Settings<impl Read>) -> Result<(), Box<dyn Error>> {
    let logic_manager = logic::Manager::new(
        serde_json::from_reader(BufReader::new(settings.raw_spoiler))?,
        read_unlocked_locations(settings.tracker_log)?,
    );

    let key_items = logic_manager.reachable_key_items();
    let cost_unlocks = logic_manager.reachable_cost_unlocks();
    if key_items.is_empty() && cost_unlocks.is_empty() {
        writeln!(
            output,
            "Oh no, we couldn't find any single pickup that unlocks new locations. \
            This most likely means your save has an edge case we haven't handled yet. \
            sgrif#3891 in Discord would appreciate a ping."
        )?;
    }

    for key_item in key_items {
        write!(output, "Getting ")?;
        if settings.show_items {
            write!(output, "{}", key_item.item)?;
        } else {
            write!(output, "the item")?;
        }
        write!(output, " at {} will unlock", key_item.location)?;
        if settings.show_unlocked_locations {
            writeln!(output, ":")?;
            for location in key_item.unlocked_locations {
                writeln!(output, "- {}", location)?;
            }
        } else {
            writeln!(output, " {} locations", key_item.unlocked_locations.len())?;
        }
    }

    for cost_unlock in cost_unlocks {
        write!(
            output,
            "Getting all reachable {} will unlock {} items at ",
            cost_unlock.term.to_lowercase(),
            cost_unlock.count
        )?;
        if settings.show_unlocked_locations {
            writeln!(output, "{}", cost_unlock.location)?;
        } else {
            writeln!(output, "a shop")?;
        }
    }

    Ok(())
}

fn read_unlocked_locations(reader: impl Read) -> Result<HashSet<String>, Box<dyn Error>> {
    const HEADER: &str = "LOCATION CLEARED --- {";
    let reader = BufReader::new(reader);
    reader
        .lines()
        .filter(|line| {
            line.as_ref()
                .map(|l| l.starts_with(HEADER))
                .unwrap_or(false)
        })
        .map(|line| {
            let line = line?;
            Ok(line[HEADER.len()..line.len() - 1].to_string())
        })
        .collect()
}
