import * as wasm from "hollow-rando-im-stuck";
import { fileOpen } from "browser-fs-access";
import { get, set } from "idb-keyval";

let select_files = document.querySelector("#select_files");
let run_button = document.querySelector("#run");
let show_items_cb = document.querySelector("#show_items");
let show_unlocked_locations_cb = document.querySelector("#show_unlocked_locations");
let output = document.querySelector("#output");
let raw_spoiler_status = document.querySelector("#raw_spoiler_status");
let tracker_log_status = document.querySelector("#tracker_log_status");

class Files {
  static async try_deserialize() {
    let files = new Files;
    files.raw_spoiler = await File.try_deserialize("RawSpoiler.json");
    files.tracker_log = await File.try_deserialize("TrackerLog.txt");
    return files;
  }

  async open_picker() {
    let files = await fileOpen({
      description: "RawSpoiler.json and TrackerLog.txt",
      multiple: true
    });
    await this.raw_spoiler.find_in_list(files);
    await this.tracker_log.find_in_list(files);
  }
}

class File {
  static async try_deserialize(name) {
    let file = new File;
    file.name = name;
    file.handle = await get(name);
    return file;
  }

  async find_in_list(list) {
    let new_file;
    if (new_file = list.find((f) => f.name == this.name)) {
      this.file = new_file
      this.handle = new_file.handle
      await set(this.name, new_file.handle);
    }
  }

  async is_available() {
    if (this.handle) {
      return this.handle_has_permission();
    } else {
      return this.file;
    }
  }

  async handle_has_permission() {
    return this.handle && await this.handle.queryPermission() != "denied"
  }

  async get_data() {
    if (this.handle && await this.handle.requestPermission() == "granted") {
      this.file = await this.handle.getFile();
    }
    return new Uint8Array(await this.file.arrayBuffer());
  }

  async status() {
    if (await this.handle_has_permission()) {
      return `${this.name} will be reloaded when changed`;
    } else if (this.file) {
      return `${this.name} selected (automatic reloading not detected. Click "Select Files" when the file changes, or use a chromium based browser`;
    }
    return `${this.name} has not been selected`;
  }
}

async function render_file_status() {
  let raw_spoiler_available = await files.raw_spoiler.is_available();
  let tracker_log_available = await files.tracker_log.is_available();
  raw_spoiler_status.innerHTML = await files.raw_spoiler.status();
  tracker_log_status.innerHTML = await files.tracker_log.status();
  run_button.disabled = !(raw_spoiler_available && tracker_log_available);
}

(async () => {
  window.files = await Files.try_deserialize();
  await render_file_status();

  select_files.addEventListener("click", async function() {
    await files.open_picker();
    await render_file_status();
  });

  run_button.addEventListener("click", async function() {
    output.innerHTML = wasm.run(
      await files.raw_spoiler.get_data(),
      await files.tracker_log.get_data(),
      show_items_cb.checked,
      show_unlocked_locations_cb.checked,
    );
  })
})();
