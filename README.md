Hollow Knight Randomizer "I'm Stuck" Solver
===

Have you had a randomizer run where you've checked every item but still don't
know where to go? Is there a skip that's really difficult for you and you want
to know if it's worth the time? This tool can help.

Give it a path to your save files, and it will tell you what items you can reach
which will unlock new items/locations.

Usage
---

`hollow_rando_im_stuck path/to/save`

On Windows with the default save locations, this would look like

`hollow_rando_im_stuck.exe "%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight\Randomizer 4\user1"`
(replace user1 with user2-4 for other save slots)

The path must be a directory containing `RawSpoilerLog.json` and
`TrackerDataWithoutSequenceBreaksPM.txt`

By default, the tool will tell you the locations you should check, and how many
new locations will be unlocked by checking it. For example, "Getting the item at
Grubfather will unlock 13 locations". You can get the name of the item to pick
up by passing `--show-items`, and get the names of the locations each item
unlocks by passing `--show-unlocked-locations`.

Run `hollow_rando_im_stuck --help` for more info

Development Status
---

This is a very early proof of concept, and likely has many edge cases that I are
not yet handled. See the list of known issues below. Additionally, the current
UI is a very crude CLI that has been used for prototyping. The goal is to
eventually provide a web frontend and/or GUI application.

This has not yet been tested with mods that add new items/checks or modify the
logic, but I have no reason to believe that it will struggle with those.

Known Issues
---

- The tool knows nothing about costs. It will assume you can afford everything
  from Grubfather/Jiji/Salubra.
- The tool will only provide an answer if a single pickup would unlock a new
  location. It will fail if a new location is only unlocked by picking up two
  separate items.
- Notch costs are ignored. It is assumed you always have enough notches to wear
  any charms needed.

License
---

Licensed under either of these:

 * Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or
   https://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or
   https://opensource.org/licenses/MIT)

Unless you explicitly state otherwise, any contribution you intentionally submit
for inclusion in the work, as defined in the Apache-2.0 license, shall be
dual-licensed as above, without any additional terms or conditions.
