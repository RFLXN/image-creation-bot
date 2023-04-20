import { readdir } from "fs/promises";
import { resolve, WEBUI_ROOT } from "../util/path";

const LORA_PATH = resolve(WEBUI_ROOT, "models", "Lora");

const getLoraList = async (): Promise<string[]> => (await readdir(LORA_PATH))
    .filter(
        (raw) => raw.endsWith(".safetensors") || raw.endsWith(".pt")
    )
    .map(
        (raw) => raw.replace(".safetensors", "")
            .replace(".pt", "")
    );

const createLoraTag = (loraName: string, weight: number) => `<lora:${loraName}:${weight}>`;

export { getLoraList, createLoraTag };
