import { readdir } from "fs/promises";
import { resolve } from "../util/path";
import { getServerPath } from "./config";

const VAE_PATH = resolve(getServerPath(), "models", "VAE");

const getVaeList = async (): Promise<string[]> => (await readdir(VAE_PATH))
    .filter((raw) => raw.endsWith(".pt") || raw.endsWith(".ckpt") || raw.endsWith(".safetensors"));

export default getVaeList;
