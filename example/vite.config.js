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
