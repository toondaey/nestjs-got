export function isPromise<T extends Record<string, any> = any>(
    input: T,
): boolean {
    return input instanceof Promise || 'then' in input;
}
