const randomInt = (min: number, max: number) => {
    const randomNum = Math.random();
    return Math.floor(randomNum * (max - min + 1)) + min;
};

export { randomInt };
