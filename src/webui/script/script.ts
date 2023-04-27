import { ScriptParamGenerator, ScriptParams } from "../../type/image";

interface Script<T extends ScriptParams> {
    name: string;
    generator: ScriptParamGenerator<T>;
    type: { new(): T };
}

export default Script;
