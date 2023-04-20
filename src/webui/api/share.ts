import axios from "axios";
// ignore because there is no @types/camelize
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import camelize from "camelize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import snakeize from "snakeize";

const BASE_URL = "http://127.0.0.1:7861";
const createUrl = (path: string) => `${BASE_URL}${path}`;

const post = async <Req, Res>(path: string, data?: Req): Promise<Res> => {
    let res;

    if (data) {
        const snakeData = snakeize(data);
        res = await axios.post(createUrl(path), snakeData);
    } else {
        res = await axios.post(createUrl(path));
    }

    return camelize(res.data) as Res;
};

const get = async <Res>(path: string) => {
    const res = await axios.get(createUrl(path));

    return camelize(res.data) as Res;
};

export { post, get };
