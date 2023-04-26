const omit = <T, K extends keyof T>(obj: T, property: K) => {
    const copied: Partial<T> = obj;

    if (copied[property]) {
        delete copied[property];
    }

    return copied as Omit<T, K>;
};

export default omit;
