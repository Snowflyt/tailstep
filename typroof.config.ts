import { defineConfig } from "typroof/config";

export default defineConfig({
  tsConfigFilePath: "./tsconfig.test.json",
  testFiles: "src/**/*.proof.ts",
});
