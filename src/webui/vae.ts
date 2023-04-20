import { readdir } from "fs/promises";
import { resolve, WEBUI_ROOT } from "../util/path";

const VAE_PATH = resolve(WEBUI_ROOT, "models", "VAE");

const getVaeList = async (): Promise<string[]> => (await readdir(VAE_PATH)).filter((raw) => raw.endsWith(".vae.pt"));

export default getVaeList;
