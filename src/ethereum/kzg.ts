import { loadKZG } from "kzg-wasm";

const kzgPromise = loadKZG();
export const getKZG = async () => {
  return kzgPromise;
};
