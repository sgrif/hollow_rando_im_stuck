use clap::Parser;
use hollow_rando_im_stuck::*;
use std::error::Error;
use std::fs::File;
use std::io::stdout;
use std::path::PathBuf;
use std::process::exit;

#[derive(Parser)]
struct Cli {
    /// The path to the directory containing your Randomizer spoiler logs. For example,
    /// "%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight\Randomizer 4\Recent"
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
    let settings = Settings {
        raw_spoiler: File::open(spoiler_path)?,
        tracker_data: File::open(tracker_path)?,
        show_unlocked_locations: cli.show_unlocked_locations,
        show_items: cli.show_items,
    };
    run(&mut stdout().lock(), settings)
}
