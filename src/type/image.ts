interface CreatedImage {
    base64image: string,
    info: string
}

interface Model {
    name: string;
    hash: string;
}

export { CreatedImage, Model };
