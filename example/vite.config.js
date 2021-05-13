import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import EasyCdn from "../src/index.ts";

{
  /* <script
  src=""
  =""
  =""
></script>; */
}
export default defineConfig({
  plugins: [
    vue(),
    EasyCdn([
      {
        name: "vue",
        var: "Vue",
        path: "/dist/vue.global.prod.js",
      },
      // css
      {
        path: "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap-grid.min.css",
      },
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
