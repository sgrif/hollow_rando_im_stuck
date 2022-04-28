use std::error::Error;
use std::io::prelude::*;
use std::io::BufReader;

pub(super) fn read(reader: impl Read) -> Result<Vec<(String, String)>, Box<dyn Error>> {
    const HEADER: &str = "ITEM OBTAINED --- {";
    const SEP: &str = "} at {";
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
            let sep_location = line.find(SEP).ok_or("invalid ITEM OBTAINED line")?;
            let item_name = match &line[HEADER.len()..sep_location] {
                "Kingsoul" => "King_Fragment",
                other => other,
            }
            .to_string();
            let location_name = line[sep_location + SEP.len()..line.len() - 1].to_string();
            Ok((item_name, location_name))
        })
        .collect()
}
