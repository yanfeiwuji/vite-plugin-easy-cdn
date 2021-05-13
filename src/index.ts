import * as path from "path";
import mkdirp from "mkdirp-sync";
import * as fs from "fs";
import { createHash } from "crypto";

// from vite
interface HtmlTagDescriptor {
  tag: string;
  attrs?: Record<string, string>;
  children?: string | HtmlTagDescriptor[];
  /**
   * 默认： 'head-prepend'
   */
  injectTo?: "head" | "body" | "head-prepend" | "body-prepend";
}

// cdn 的配置
interface CdnInfo {
  name: string;
  var: string;
  // path 以 http 开始就用 http地址
  path: string;
  tag?: HtmlTagDescriptor;
}

const cdnCode = (npmName: string, windowName: string) => {
  const exports = require(path.resolve(process.cwd(), "node_modules", npmName));
  const eachExport = Object.keys(exports)
    .filter((key) => /^[\w|_]+$/.test(key))
    .map((key) => `export const ${key} = modules["${key}"];`);

  return `var modules = window["${windowName}"];
        ${eachExport.join("\n")}
        export default modules;`;
};

const getAssetHash = (content: Buffer | string): string => {
  return createHash("sha256").update(content).digest("hex").slice(0, 8);
};

const optimizeCacheDir = path.join(
  process.cwd(),
  `node_modules/.vite-plugin-easy-cdn`
);

const packageJsonDev = () => {
  const data = fs.readFileSync(
    path.join(process.cwd(), "package.json"),
    "utf8"
  );
  const json = JSON.parse(data);
  return json.dependencies;
};

const htmlAddCdn = (html, cdns: Array<CdnInfo | String>) => {
  const dependencies = packageJsonDev();

  const baseUrlTemp = "";

  // 转化
  const tags = cdns
    .map((c) => (typeof c === "string" ? { path: c as String } : c) as CdnInfo)

    .map((c) => {
      // c.tag 优先级最高
      if (c.tag) {
        return c.tag;
      }
      // 只有 js 有name和var
      const tag = c.name && c.var ? "script" : "link";
      if (tag === "script") {
        const src =
          c.path && c.path.startsWith("http")
            ? c.path
            : `https://unpkg.com/${c.name}@${dependencies[c.name]}${
                c.path ? c.path : ""
              }`;
        return {
          tag,
          attrs: {
            src,
          },
          injectTo: "head-prepend",
        };
      } else if (tag === "link") {
        return {
          tag,
          attrs: {
            rel: "stylesheet",
            href: c.path,
          },
        };
      }
    });
  return {
    html,
    tags,
  };
};

const EasyCdn = (cdns: Array<CdnInfo | String>) => {
  mkdirp(optimizeCacheDir);

  const alias = cdns
    .map((c) => (typeof c === "string" ? { path: c as String } : c) as CdnInfo)
    .filter((c) => c.name)
    .map((c) => {
      const code = cdnCode(c.name, c.var);
      const hash = getAssetHash(code);
      const fileName = `${c.name.replace("/", "_")}.${hash}.js`;
      const dependencyFile = path.resolve(optimizeCacheDir, fileName);
      if (!fs.existsSync(dependencyFile)) {
        fs.writeFileSync(dependencyFile, code);
      }

      return {
        find: c.name,
        replacement: dependencyFile,
      };
    });

  return {
    name: "vite:easy-cdn",
    enforce: "pre",
    config() {
      return {
        resolve: {
          alias,
        },
      };
    },
    transformIndexHtml(html) {
      return htmlAddCdn(html, cdns);
    },
  };
};

export default EasyCdn;
