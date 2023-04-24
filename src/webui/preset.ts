import { readdir } from "fs/promises";
import { resolve, RESOURCE_ROOT } from "../util/path";
import { readJson } from "../util/json";
import { Preset } from "../type/image";
import { error, log } from "../util/log";

const PRESET_PATH = resolve(RESOURCE_ROOT, "preset");

let presetList: Preset[] = [];

const getPresetFileList = async () => (await readdir(PRESET_PATH)).filter((f) => f.endsWith(".preset.json"));

const loadPreset = async () => {
    const files = await getPresetFileList();

    const presetPromises = files.map((file) => {
        const path = resolve(PRESET_PATH, file);
        return readJson<Preset>(path);
    });

    const awaitedPresets = await Promise.allSettled(presetPromises);

    const list: Preset[] = [];

    awaitedPresets.map((result) => {
        if (result.status == "rejected") {
            error(result.reason);
        } else {
            const preset = result.value;
            log(`Preset Loaded: ${preset.id} (${preset.description})`);
            list.push(preset);
        }
    });

    presetList = list;
};

const getPresetList = () => presetList;

const getPreset = (id: number) => presetList.find((p) => p.id == id);

export { loadPreset, getPresetList, getPreset };
