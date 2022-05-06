// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"aPJuQ":[function(require,module,exports) {
"use strict";
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "0a8ecb283d214d75";
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {};
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = it.call(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else if ('reload' in location) location.reload();
            else {
                // Web extension context
                var ext = typeof chrome === 'undefined' ? typeof browser === 'undefined' ? null : browser : chrome;
                if (ext && ext.runtime && ext.runtime.reload) ext.runtime.reload();
            }
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                var oldDeps = modules[asset.id][1];
                for(var dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    var id = oldDeps[dep];
                    var parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    var modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        var deps = modules[id1][1];
        var orphans = [];
        for(var dep in deps){
            var parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach(function(id) {
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    var parents = getParents(module.bundle.root, id);
    var accepted = false;
    while(parents.length > 0){
        var v = parents.shift();
        var a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            var p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push.apply(parents, _toConsumableArray(p));
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"bB7Pu":[function(require,module,exports) {
var _hollowRandoImStuckWasmJs = require("./pkg/hollow_rando_im_stuck_wasm.js");
var _browserFsAccess = require("browser-fs-access");
var _idbKeyval = require("idb-keyval");
let select_files = document.querySelector("#select_files");
let run_button = document.querySelector("#run");
let show_items_cb = document.querySelector("#show_items");
let show_unlocked_locations_cb = document.querySelector("#show_unlocked_locations");
let output = document.querySelector("#output");
let raw_spoiler_status = document.querySelector("#raw_spoiler_status");
let tracker_data_status = document.querySelector("#tracker_data_status");
class Files {
    static async try_deserialize() {
        let files = new Files;
        files.raw_spoiler = await File.try_deserialize("RawSpoiler.json");
        files.tracker_data = await File.try_deserialize("TrackerData.json");
        return files;
    }
    async open_picker() {
        let files = await _browserFsAccess.fileOpen({
            description: "RawSpoiler.json and TrackerData.json",
            multiple: true
        });
        await this.raw_spoiler.find_in_list(files);
        await this.tracker_data.find_in_list(files);
    }
}
class File {
    static async try_deserialize(name) {
        let file = new File;
        file.name = name;
        file.handle = await _idbKeyval.get(name);
        return file;
    }
    async find_in_list(list) {
        let new_file;
        if (new_file = list.find((f)=>f.name == this.name
        )) {
            this.file = new_file;
            this.handle = new_file.handle;
            await _idbKeyval.set(this.name, new_file.handle);
        }
    }
    async is_available() {
        if (this.handle) return this.handle_has_permission();
        else return this.file;
    }
    async handle_has_permission() {
        return this.handle && await this.handle.queryPermission() != "denied";
    }
    async get_data() {
        if (this.handle && await this.handle.requestPermission() == "granted") this.file = await this.handle.getFile();
        return new Uint8Array(await this.file.arrayBuffer());
    }
    async status() {
        if (await this.handle_has_permission()) return `${this.name} will be reloaded when changed`;
        else if (this.file) return `${this.name} selected (automatic reloading not detected. Click "Select Files" when the file changes, or use a chromium based browser`;
        return `${this.name} has not been selected`;
    }
}
async function render_file_status() {
    let raw_spoiler_available = await files.raw_spoiler.is_available();
    let tracker_data_available = await files.tracker_data.is_available();
    raw_spoiler_status.innerHTML = await files.raw_spoiler.status();
    tracker_data_status.innerHTML = await files.tracker_data.status();
    run_button.disabled = !(raw_spoiler_available && tracker_data_available);
}
(async ()=>{
    await _hollowRandoImStuckWasmJs.default();
    window.files = await Files.try_deserialize();
    await render_file_status();
    select_files.addEventListener("click", async function() {
        await files.open_picker();
        await render_file_status();
    });
    run_button.addEventListener("click", async function() {
        output.innerHTML = _hollowRandoImStuckWasmJs.run(await files.raw_spoiler.get_data(), await files.tracker_data.get_data(), show_items_cb.checked, show_unlocked_locations_cb.checked);
    });
})();

},{"./pkg/hollow_rando_im_stuck_wasm.js":"7rlEY","browser-fs-access":"luBuG","idb-keyval":"lciyz"}],"7rlEY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
* @param {Uint8Array} raw_spoiler
* @param {Uint8Array} tracker_data
* @param {boolean} show_items
* @param {boolean} show_unlocked_locations
* @returns {string | undefined}
*/ parcelHelpers.export(exports, "run", ()=>run
);
let wasm;
const cachedTextDecoder = new TextDecoder('utf-8', {
    ignoreBOM: true,
    fatal: true
});
cachedTextDecoder.decode();
let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    return cachegetUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
let WASM_VECTOR_LEN = 0;
function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    return cachegetInt32Memory0;
}
function run(raw_spoiler, tracker_data, show_items, show_unlocked_locations) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(raw_spoiler, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(tracker_data, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.run(retptr, ptr0, len0, ptr1, len1, show_items, show_unlocked_locations);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v2;
        if (r0 !== 0) {
            v2 = getStringFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
        }
        return v2;
    } finally{
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') try {
            return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
            if (module.headers.get('Content-Type') != 'application/wasm') console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
            else throw e;
        }
        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);
        if (instance instanceof WebAssembly.Instance) return {
            instance,
            module
        };
        else return instance;
    }
}
async function init(input) {
    if (typeof input === 'undefined') input = new URL(require("5e05ced117b63a05"));
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_alert_2732dbdb1fb5fe0d = function(arg0, arg1) {
        alert(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_0;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };
    if (typeof input === 'string' || typeof Request === 'function' && input instanceof Request || typeof URL === 'function' && input instanceof URL) input = fetch(input);
    const { instance , module  } = await load(await input, imports);
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}
exports.default = init;

},{"5e05ced117b63a05":"g7drd","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"g7drd":[function(require,module,exports) {
module.exports = require('./helpers/bundle-url').getBundleURL('UckoE') + "hollow_rando_im_stuck_wasm_bg.3139e1e7.wasm" + "?" + Date.now();

},{"./helpers/bundle-url":"lgJ39"}],"lgJ39":[function(require,module,exports) {
"use strict";
var bundleURL = {};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ('' + err.stack).match(/(https?|file|ftp|(chrome|moz)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return '/';
}
function getBaseURL(url) {
    return ('' + url).replace(/^((?:https?|file|ftp|(chrome|moz)-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ('' + url).match(/(https?|file|ftp|(chrome|moz)-extension):\/\/[^/]+/);
    if (!matches) throw new Error('Origin not found');
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"luBuG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "directoryOpen", ()=>i
);
parcelHelpers.export(exports, "directoryOpenLegacy", ()=>v
);
parcelHelpers.export(exports, "directoryOpenModern", ()=>y
);
parcelHelpers.export(exports, "fileOpen", ()=>n
);
parcelHelpers.export(exports, "fileOpenLegacy", ()=>w
);
parcelHelpers.export(exports, "fileOpenModern", ()=>s
);
parcelHelpers.export(exports, "fileSave", ()=>o
);
parcelHelpers.export(exports, "fileSaveLegacy", ()=>P
);
parcelHelpers.export(exports, "fileSaveModern", ()=>d
);
parcelHelpers.export(exports, "supported", ()=>e
);
const e = (()=>{
    if ("undefined" == typeof self) return !1;
    if ("top" in self && self !== top) ;
    else if ("showOpenFilePicker" in self) return "showOpenFilePicker";
    return !1;
})(), t = e ? Promise.resolve().then(function() {
    return c;
}) : Promise.resolve().then(function() {
    return h;
});
async function n(...e1) {
    return (await t).default(...e1);
}
const r = e ? Promise.resolve().then(function() {
    return f;
}) : Promise.resolve().then(function() {
    return b;
});
async function i(...e2) {
    return (await r).default(...e2);
}
const a = e ? Promise.resolve().then(function() {
    return m;
}) : Promise.resolve().then(function() {
    return _;
});
async function o(...e3) {
    return (await a).default(...e3);
}
const l = async (e4)=>{
    const t1 = await e4.getFile();
    return t1.handle = e4, t1;
};
var s = async (e5 = [
    {}
])=>{
    Array.isArray(e5) || (e5 = [
        e5
    ]);
    const t2 = [];
    e5.forEach((e6, n2)=>{
        t2[n2] = {
            description: e6.description || "",
            accept: {}
        }, e6.mimeTypes ? e6.mimeTypes.map((r2)=>{
            t2[n2].accept[r2] = e6.extensions || [];
        }) : t2[n2].accept["*/*"] = e6.extensions || [];
    });
    const n1 = await window.showOpenFilePicker({
        id: e5[0].id,
        startIn: e5[0].startIn,
        types: t2,
        multiple: e5[0].multiple || !1,
        excludeAcceptAllOption: e5[0].excludeAcceptAllOption || !1
    }), r1 = await Promise.all(n1.map(l));
    return e5[0].multiple ? r1 : r1[0];
}, c = {
    __proto__: null,
    default: s
};
function u(e7) {
    function t3(e8) {
        if (Object(e8) !== e8) return Promise.reject(new TypeError(e8 + " is not an object."));
        var t4 = e8.done;
        return Promise.resolve(e8.value).then(function(e9) {
            return {
                value: e9,
                done: t4
            };
        });
    }
    return u = function(e10) {
        this.s = e10, this.n = e10.next;
    }, u.prototype = {
        s: null,
        n: null,
        next: function() {
            return t3(this.n.apply(this.s, arguments));
        },
        return: function(e11) {
            var n3 = this.s.return;
            return void 0 === n3 ? Promise.resolve({
                value: e11,
                done: !0
            }) : t3(n3.apply(this.s, arguments));
        },
        throw: function(e12) {
            var n4 = this.s.return;
            return void 0 === n4 ? Promise.reject(e12) : t3(n4.apply(this.s, arguments));
        }
    }, new u(e7);
}
const p = async (e13, t5, n5 = e13.name, r3)=>{
    const i1 = [], a1 = [];
    var o2, l1 = !1, s1 = !1;
    try {
        for(var c1, y1 = function(e14) {
            var t6, n6, r4, i2 = 2;
            for("undefined" != typeof Symbol && (n6 = Symbol.asyncIterator, r4 = Symbol.iterator); i2--;){
                if (n6 && null != (t6 = e14[n6])) return t6.call(e14);
                if (r4 && null != (t6 = e14[r4])) return new u(t6.call(e14));
                n6 = "@@asyncIterator", r4 = "@@iterator";
            }
            throw new TypeError("Object is not async iterable");
        }(e13.values()); l1 = !(c1 = await y1.next()).done; l1 = !1){
            const o1 = c1.value, l2 = `${n5}/${o1.name}`;
            "file" === o1.kind ? a1.push(o1.getFile().then((t7)=>(t7.directoryHandle = e13, t7.handle = o1, Object.defineProperty(t7, "webkitRelativePath", {
                    configurable: !0,
                    enumerable: !0,
                    get: ()=>l2
                }))
            )) : "directory" !== o1.kind || !t5 || r3 && r3(o1) || i1.push(p(o1, t5, l2, r3));
        }
    } catch (e15) {
        s1 = !0, o2 = e15;
    } finally{
        try {
            l1 && null != y1.return && await y1.return();
        } finally{
            if (s1) throw o2;
        }
    }
    return [
        ...(await Promise.all(i1)).flat(),
        ...await Promise.all(a1)
    ];
};
var y = async (e16 = {})=>{
    e16.recursive = e16.recursive || !1;
    const t8 = await window.showDirectoryPicker({
        id: e16.id,
        startIn: e16.startIn
    });
    return p(t8, e16.recursive, void 0, e16.skipDirectory);
}, f = {
    __proto__: null,
    default: y
}, d = async (e17, t9 = [
    {}
], n7 = null, r5 = !1, i3 = null)=>{
    Array.isArray(t9) || (t9 = [
        t9
    ]), t9[0].fileName = t9[0].fileName || "Untitled";
    const a2 = [];
    let o3 = null;
    if (e17 instanceof Blob && e17.type ? o3 = e17.type : e17.headers && e17.headers.get("content-type") && (o3 = e17.headers.get("content-type")), t9.forEach((e18, t10)=>{
        a2[t10] = {
            description: e18.description || "",
            accept: {}
        }, e18.mimeTypes ? (0 === t10 && o3 && e18.mimeTypes.push(o3), e18.mimeTypes.map((n8)=>{
            a2[t10].accept[n8] = e18.extensions || [];
        })) : o3 && (a2[t10].accept[o3] = e18.extensions || []);
    }), n7) try {
        await n7.getFile();
    } catch (e19) {
        if (n7 = null, r5) throw e19;
    }
    const l3 = n7 || await window.showSaveFilePicker({
        suggestedName: t9[0].fileName,
        id: t9[0].id,
        startIn: t9[0].startIn,
        types: a2,
        excludeAcceptAllOption: t9[0].excludeAcceptAllOption || !1
    });
    !n7 && i3 && i3();
    const s2 = await l3.createWritable();
    if ("stream" in e17) {
        const t11 = e17.stream();
        return await t11.pipeTo(s2), l3;
    }
    return "body" in e17 ? (await e17.body.pipeTo(s2), l3) : (await s2.write(await e17), await s2.close(), l3);
}, m = {
    __proto__: null,
    default: d
}, w = async (e20 = [
    {}
])=>(Array.isArray(e20) || (e20 = [
        e20
    ]), new Promise((t12, n9)=>{
        const r6 = document.createElement("input");
        r6.type = "file";
        const i4 = [
            ...e20.map((e21)=>e21.mimeTypes || []
            ),
            ...e20.map((e22)=>e22.extensions || []
            )
        ].join();
        r6.multiple = e20[0].multiple || !1, r6.accept = i4 || "";
        const a3 = (e23)=>{
            "function" == typeof o4 && o4(), t12(e23);
        }, o4 = e20[0].legacySetup && e20[0].legacySetup(a3, ()=>o4(n9)
        , r6);
        r6.addEventListener("change", ()=>{
            a3(r6.multiple ? Array.from(r6.files) : r6.files[0]);
        }), r6.click();
    }))
, h = {
    __proto__: null,
    default: w
}, v = async (e24 = [
    {}
])=>(Array.isArray(e24) || (e24 = [
        e24
    ]), e24[0].recursive = e24[0].recursive || !1, new Promise((t13, n10)=>{
        const r7 = document.createElement("input");
        r7.type = "file", r7.webkitdirectory = !0;
        const i5 = (e25)=>{
            "function" == typeof a4 && a4(), t13(e25);
        }, a4 = e24[0].legacySetup && e24[0].legacySetup(i5, ()=>a4(n10)
        , r7);
        r7.addEventListener("change", ()=>{
            let t14 = Array.from(r7.files);
            e24[0].recursive ? e24[0].recursive && e24[0].skipDirectory && (t14 = t14.filter((t15)=>t15.webkitRelativePath.split("/").every((t16)=>!e24[0].skipDirectory({
                        name: t16,
                        kind: "directory"
                    })
                )
            )) : t14 = t14.filter((e26)=>2 === e26.webkitRelativePath.split("/").length
            ), i5(t14);
        }), r7.click();
    }))
, b = {
    __proto__: null,
    default: v
}, P = async (e27, t17 = {})=>{
    Array.isArray(t17) && (t17 = t17[0]);
    const n11 = document.createElement("a");
    let r8 = e27;
    "body" in e27 && (r8 = await async function(e28, t18) {
        const n12 = e28.getReader(), r9 = new ReadableStream({
            start: (e29)=>(async function t19() {
                    return n12.read().then(({ done: n13 , value: r10  })=>{
                        if (!n13) return e29.enqueue(r10), t19();
                        e29.close();
                    });
                })()
        }), i7 = new Response(r9), a6 = await i7.blob();
        return n12.releaseLock(), new Blob([
            a6
        ], {
            type: t18
        });
    }(e27.body, e27.headers.get("content-type"))), n11.download = t17.fileName || "Untitled", n11.href = URL.createObjectURL(await r8);
    const i6 = ()=>{
        "function" == typeof a5 && a5();
    }, a5 = t17.legacySetup && t17.legacySetup(i6, ()=>a5()
    , n11);
    return n11.addEventListener("click", ()=>{
        setTimeout(()=>URL.revokeObjectURL(n11.href)
        , 3e4), i6();
    }), n11.click(), null;
}, _ = {
    __proto__: null,
    default: P
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lciyz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "clear", ()=>clear
);
parcelHelpers.export(exports, "createStore", ()=>createStore
);
parcelHelpers.export(exports, "del", ()=>del
);
parcelHelpers.export(exports, "delMany", ()=>delMany
);
parcelHelpers.export(exports, "entries", ()=>entries
);
parcelHelpers.export(exports, "get", ()=>get
);
parcelHelpers.export(exports, "getMany", ()=>getMany
);
parcelHelpers.export(exports, "keys", ()=>keys
);
parcelHelpers.export(exports, "promisifyRequest", ()=>promisifyRequest
);
parcelHelpers.export(exports, "set", ()=>set
);
parcelHelpers.export(exports, "setMany", ()=>setMany
);
parcelHelpers.export(exports, "update", ()=>update
);
parcelHelpers.export(exports, "values", ()=>values
);
var _safari14IdbFix = require("safari-14-idb-fix");
var _safari14IdbFixDefault = parcelHelpers.interopDefault(_safari14IdbFix);
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
        // @ts-ignore - file size hacks
        request.oncomplete = request.onsuccess = function() {
            return resolve(request.result);
        }; // @ts-ignore - file size hacks
        request.onabort = request.onerror = function() {
            return reject(request.error);
        };
    });
}
function createStore(dbName, storeName) {
    var dbp = _safari14IdbFixDefault.default().then(function() {
        var request = indexedDB.open(dbName);
        request.onupgradeneeded = function() {
            return request.result.createObjectStore(storeName);
        };
        return promisifyRequest(request);
    });
    return function(txMode, callback) {
        return dbp.then(function(db) {
            return callback(db.transaction(storeName, txMode).objectStore(storeName));
        });
    };
}
var defaultGetStoreFunc;
function defaultGetStore() {
    if (!defaultGetStoreFunc) defaultGetStoreFunc = createStore('keyval-store', 'keyval');
    return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function get(key) {
    var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
    return customStore('readonly', function(store) {
        return promisifyRequest(store.get(key));
    });
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function set(key, value) {
    var customStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGetStore();
    return customStore('readwrite', function(store) {
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Set multiple values at once. This is faster than calling set() multiple times.
 * It's also atomic – if one of the pairs can't be added, none will be added.
 *
 * @param entries Array of entries, where each entry is an array of `[key, value]`.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function setMany(entries1) {
    var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
    return customStore('readwrite', function(store) {
        entries1.forEach(function(entry) {
            return store.put(entry[1], entry[0]);
        });
        return promisifyRequest(store.transaction);
    });
}
/**
 * Get multiple values by their keys
 *
 * @param keys
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function getMany(keys1) {
    var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
    return customStore('readonly', function(store) {
        return Promise.all(keys1.map(function(key) {
            return promisifyRequest(store.get(key));
        }));
    });
}
/**
 * Update a value. This lets you see the old value and update it as an atomic operation.
 *
 * @param key
 * @param updater A callback that takes the old value and returns a new value.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function update(key, updater) {
    var customStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGetStore();
    return customStore('readwrite', function(store) {
        return(// If I try to chain promises, the transaction closes in browsers
        // that use a promise polyfill (IE10/11).
        new Promise(function(resolve, reject) {
            store.get(key).onsuccess = function() {
                try {
                    store.put(updater(this.result), key);
                    resolve(promisifyRequest(store.transaction));
                } catch (err) {
                    reject(err);
                }
            };
        }));
    });
}
/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function del(key) {
    var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
    return customStore('readwrite', function(store) {
        store.delete(key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Delete multiple keys at once.
 *
 * @param keys List of keys to delete.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function delMany(keys2) {
    var customStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetStore();
    return customStore('readwrite', function(store) {
        keys2.forEach(function(key) {
            return store.delete(key);
        });
        return promisifyRequest(store.transaction);
    });
}
/**
 * Clear all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function clear() {
    var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
    return customStore('readwrite', function(store) {
        store.clear();
        return promisifyRequest(store.transaction);
    });
}
function eachCursor(store, callback) {
    store.openCursor().onsuccess = function() {
        if (!this.result) return;
        callback(this.result);
        this.result.continue();
    };
    return promisifyRequest(store.transaction);
}
/**
 * Get all keys in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function keys() {
    var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
    return customStore('readonly', function(store) {
        // Fast path for modern browsers
        if (store.getAllKeys) return promisifyRequest(store.getAllKeys());
        var items = [];
        return eachCursor(store, function(cursor) {
            return items.push(cursor.key);
        }).then(function() {
            return items;
        });
    });
}
/**
 * Get all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function values() {
    var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
    return customStore('readonly', function(store) {
        // Fast path for modern browsers
        if (store.getAll) return promisifyRequest(store.getAll());
        var items = [];
        return eachCursor(store, function(cursor) {
            return items.push(cursor.value);
        }).then(function() {
            return items;
        });
    });
}
/**
 * Get all entries in the store. Each entry is an array of `[key, value]`.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */ function entries() {
    var customStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultGetStore();
    return customStore('readonly', function(store1) {
        // Fast path for modern browsers
        // (although, hopefully we'll get a simpler path some day)
        if (store1.getAll && store1.getAllKeys) return Promise.all([
            promisifyRequest(store1.getAllKeys()),
            promisifyRequest(store1.getAll())
        ]).then(function(_ref) {
            var _ref2 = _slicedToArray(_ref, 2), keys3 = _ref2[0], values1 = _ref2[1];
            return keys3.map(function(key, i) {
                return [
                    key,
                    values1[i]
                ];
            });
        });
        var items = [];
        return customStore('readonly', function(store) {
            return eachCursor(store, function(cursor) {
                return items.push([
                    cursor.key,
                    cursor.value
                ]);
            }).then(function() {
                return items;
            });
        });
    });
}

},{"safari-14-idb-fix":"2qe4W","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2qe4W":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Work around Safari 14 IndexedDB open bug.
 *
 * Safari has a horrible bug where IDB requests can hang while the browser is starting up. https://bugs.webkit.org/show_bug.cgi?id=226547
 * The only solution is to keep nudging it until it's awake.
 */ function idbReady() {
    var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
    // No point putting other browsers or older versions of Safari through this mess.
    if (!isSafari || !indexedDB.databases) return Promise.resolve();
    var intervalId;
    return new Promise(function(resolve) {
        var tryIdb = function() {
            return indexedDB.databases().finally(resolve);
        };
        intervalId = setInterval(tryIdb, 100);
        tryIdb();
    }).finally(function() {
        return clearInterval(intervalId);
    });
}
exports.default = idbReady;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["aPJuQ","bB7Pu"], "bB7Pu", "parcelRequire9427")

//# sourceMappingURL=index.3d214d75.js.map
