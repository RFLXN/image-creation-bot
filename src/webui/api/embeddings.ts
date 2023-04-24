import { get } from "./share";

const PATH = "/sdapi/v1/embeddings";

interface GetEmbeddingsRes {
    loaded: any;
    skipped: any;
}

const getEmbeddings = async () => get<GetEmbeddingsRes>(PATH);

export { getEmbeddings, GetEmbeddingsRes };
