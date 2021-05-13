# vite-plugin-easy-cdn
## todo

## use
```shell
npm i vite-plugin-easy-cdn --save-dev
```
```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import EasyCdn from "vite-plugin-easy-cdn";

export default defineConfig({
  plugins: [
    vue(),
     EasyCdn([
       // js
      {
        name: "vue",
        var: "Vue",
        path: "/dist/vue.global.prod.js",
      },
      // css
      {
        path: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap-grid.min.css",
      },
      // js
      {
        name: "pako",
        var: "pako",
        path: "https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js",
      },
      // custom tag
      {
        htmlTag: {
          tag: "script",
          attrs: {
            src: "https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js",
            integrity:
              "sha512-yJSo0YTQvvGOqL2au5eH0W4K/0FI0sTJuyHjiHkh0O31Lzlb814P0fDXtuEtzOj13lOBZ9j99BjqFx4ASz9pGA==",
            crossorigin: "anonymous",
          },
        },
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
}

// cdn 的配置
interface CdnInfo {
  name: string;
  var: string;
  // js 有name and var css only path
  path: string;
  htmlTag?: HtmlTagDescriptor;
}

```
## 说明：
默认使用https://unpkg.com/下的包