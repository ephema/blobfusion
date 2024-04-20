import { blobSubmitterPublicClient } from "../viemClients";

export const getCurrentGasPrice = () => blobSubmitterPublicClient.getGasPrice();
