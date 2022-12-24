// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Forces a function to only take one argument
 * @param f The function to convert
 * @returns A wrapper function that only passes the first argument to f
 */
export function o<I, O>(f: (v: I) => O): (v: I) => O {
    return (v: I) => f(v);
}

export function* shiftIterator<E>(array: E[]) {
    while (array.length) {
        yield array.shift();
    }
}

export function mult(v1: number, v2: number) {
    return v1 * v2;
}

export function sum(v1: number, v2: number) {
    return v1 + v2;
}
