import { PathLike } from "fs";
import { readFile, writeFile } from "fs/promises";

const readJson = async <T extends object>(path: PathLike): Promise<T> => {
    const raw = await readFile(path);
    return JSON.parse(raw.toString("utf8"));
};

const writeJson = async <T extends object>(path: PathLike, obj: T) => {
    await writeFile(path, JSON.stringify(obj));
};

export { readJson, writeJson };
