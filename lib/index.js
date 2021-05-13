var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
__markAsModule(exports);
__export(exports, {
  default: () => src_default
});
var path = __toModule(require("path"));
var import_mkdirp_sync = __toModule(require("mkdirp-sync"));
var fs = __toModule(require("fs"));
var import_crypto = __toModule(require("crypto"));
const cdnCode = (npmName, windowName) => {
  const exports = require(path.resolve(process.cwd(), "node_modules", npmName));
  const eachExport = Object.keys(exports).filter((key) => /^[\w|_]+$/.test(key)).map((key) => `export const ${key} = modules["${key}"];`);
  return `var modules = window["${windowName}"];
        ${eachExport.join("\n")}
        export default modules;`;
};
const getAssetHash = (content) => {
  return (0, import_crypto.createHash)("sha256").update(content).digest("hex").slice(0, 8);
};
const optimizeCacheDir = path.join(process.cwd(), `node_modules/.vite-plugin-easy-cdn`);
const packageJsonDev = () => {
  const data = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8");
  const json = JSON.parse(data);
  return json.dependencies;
};
const htmlAddCdn = (html, cdns) => {
  const dependencies = packageJsonDev();
  const baseUrlTemp = "";
  const tags = cdns.map((c) => typeof c === "string" ? {path: c} : c).map((c) => {
    if (c.tag) {
      return c.tag;
    }
    const tag = c.name && c.var ? "script" : "link";
    if (tag === "script") {
      const src = c.path && c.path.startsWith("http") ? c.path : `https://unpkg.com/${c.name}@${dependencies[c.name]}${c.path ? c.path : ""}`;
      return {
        tag,
        attrs: {
          src
        },
        injectTo: "head-prepend"
      };
    } else if (tag === "link") {
      return {
        tag,
        attrs: {
          rel: "stylesheet",
          href: c.path
        }
      };
    }
  });
  return {
    html,
    tags
  };
};
const EasyCdn = (cdns) => {
  (0, import_mkdirp_sync.default)(optimizeCacheDir);
  const alias = cdns.map((c) => typeof c === "string" ? {path: c} : c).filter((c) => c.name).map((c) => {
    const code = cdnCode(c.name, c.var);
    const hash = getAssetHash(code);
    const fileName = `${c.name.replace("/", "_")}.${hash}.js`;
    const dependencyFile = path.resolve(optimizeCacheDir, fileName);
    if (!fs.existsSync(dependencyFile)) {
      fs.writeFileSync(dependencyFile, code);
    }
    return {
      find: c.name,
      replacement: dependencyFile
    };
  });
  return {
    name: "vite:easy-cdn",
    enforce: "pre",
    config() {
      return {
        resolve: {
          alias
        }
      };
    },
    transformIndexHtml(html) {
      return htmlAddCdn(html, cdns);
    }
  };
};
var src_default = EasyCdn;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
