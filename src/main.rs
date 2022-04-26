use crate::spoiler_log::RawSpoiler;
use std::env::args;
use std::error::Error;
use std::fs::File;
use std::io::BufReader;
use std::process::exit;

pub(crate) mod logic;
mod spoiler_log;

fn main() {
    if let Err(e) = try_main() {
        eprintln!("{}", e);
        exit(1)
    }
}

fn try_main() -> Result<(), Box<dyn Error>> {
    let args = args().skip(1).collect::<Vec<_>>();
    assert_eq!(args.len(), 1, "expected a single argument");
    let mut file = BufReader::new(File::open(&args[0])?);
    let spoiler: RawSpoiler = serde_json::from_reader(&mut file)?;
    println!("{:?}", spoiler.logic_manager.logic[0]);
    Ok(())
}
