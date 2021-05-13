# vite-plugin-easy-cdn
## todo

## use
```shell
```
```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import EasyCdn from "../../vite-plugin-easy-cdn/src/index.ts";

export default defineConfig({
  plugins: [
    vue(),
    EasyCdn([
      {
        name: "vue",
        var: "Vue",
        path: "/dist/vue.global.prod.js",
      },
    ]),
  ],
});

```
## config
```javascript
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
  // js 有name and var css only path
  path: string;
  tag?: HtmlTagDescriptor;
}
```
## 说明：
默认使用https://unpkg.com/下的包