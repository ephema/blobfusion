import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./src",
    "!src/ethereum/contracts",
    "!src/ethereum/ignition",
    "!src/ethereum/test",
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
});
