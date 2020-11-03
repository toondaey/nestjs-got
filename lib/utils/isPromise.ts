export function isPromise<T = any>(input: T): boolean {
    return input instanceof Promise || 'then' in input;
}
