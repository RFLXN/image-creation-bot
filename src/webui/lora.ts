import { readdir } from "fs/promises";
import { resolve } from "../util/path";
import { getServerPath } from "./config";

const LORA_PATH = resolve(getServerPath(), "models", "Lora");

const getLoraList = async (): Promise<string[]> => (await readdir(LORA_PATH))
    .filter(
        (raw) => raw.endsWith(".safetensors") || raw.endsWith(".pt") || raw.endsWith(".ckpt")
    )
    .map(
        (raw) => raw.replace(".safetensors", "")
            .replace(".pt", "")
            .replace(".ckpt", "")
    );

const createLoraTag = (loraName: string, weight: number) => `<lora:${loraName}:${weight}>`;

export { getLoraList, createLoraTag };
