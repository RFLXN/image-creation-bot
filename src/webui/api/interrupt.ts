import { post } from "./share";

const PATH = "/sdapi/v1/interrupt";

const interrupt = async () => post(PATH);

export { interrupt };
