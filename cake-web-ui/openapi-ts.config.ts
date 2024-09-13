import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://127.0.0.1:3000/api-docs/openapi.json",
  client: "axios",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/client",
  },
});
