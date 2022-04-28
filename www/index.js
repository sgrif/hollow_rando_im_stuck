import * as wasm from "hollow-rando-im-stuck";
import { fileOpen } from "browser-fs-access";

let select_files = document.querySelector("#select_files");
let run_button = document.querySelector("#run");
let show_items_cb = document.querySelector("#show_items");
let show_unlocked_locations_cb = document.querySelector("#show_unlocked_locations");
let output = document.querySelector("#output");

var raw_spoiler = null;
var tracker_log = null;

select_files.addEventListener("click", async function() {
  let files = await fileOpen({
    description: "RawSpoiler.json and TrackerLog.txt",
    multiple: true
  });

  raw_spoiler = files.find((f) => f.name == "RawSpoiler.json") || raw_spoiler;
  if (!raw_spoiler) {
    alert("selected files did not include RawSpoiler.json");
  }
  tracker_log = files.find((f) => f.name == "TrackerLog.txt") || tracker_log;
  if (!tracker_log) {
    alert("selected files did not include TrackerLog.txt");
  }

  run_button.disabled = !(raw_spoiler && tracker_log)
});

run_button.addEventListener("click", async function() {
  output.innerHTML = wasm.run(
    new Uint8Array(await raw_spoiler.arrayBuffer()),
    new Uint8Array(await tracker_log.arrayBuffer()),
    show_items_cb.checked,
    show_unlocked_locations_cb.checked,
  );
})
