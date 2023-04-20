interface Result<T> {
    data?: T,
    success: boolean,
    error?: Error
}

interface SuccessResult<T> extends Result<T> {
    data: T,
    success: true,
    error: null
}

interface FailResult extends Result<null> {
    data: null,
    success: false,
    error: Error
}

export { Result, SuccessResult, FailResult };
