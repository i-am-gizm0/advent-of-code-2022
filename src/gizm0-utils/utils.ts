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

export function falsy(e: unknown): e is (false | 0 | 0n | '' | null | undefined) {
    return e ? false : true;
}

export function notFalsy(e: unknown) {
    return !falsy(e);
}

export type Pair<T> = [T, T];
export type KV<K, V> = [K, V];
export type Coordinate = Pair<number>;
export type Map2D<T> = T[][];

export function lookup2D<V>(map: Map2D<V>, [row, col]: Pair<number>): V {
    return map[row][col];
}
export function locate2D<V>(map: Map2D<V>, val: V): Coordinate {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const pos: Coordinate = [row, col];
            if (lookup2D(map, pos) == val) {
                return pos;
            }
        }
    }
    return [undefined, undefined];
}

export function neighbors(map: Map2D<unknown>, [row, col]: Coordinate): Coordinate[] {
    const neighbors: Coordinate[] = [];
    for (let r = row - 1; r <= row + 1; r++) {
        if (r < 0 || r >= map.length) {
            continue; 
        }
        for (let c = col - 1; c <= col + 1; c++) {
            if (c < 0 || c >= map[r].length) {
                continue;
            }

            if (r == row && c == col) {
                continue;
            }

            neighbors.push([r, c]);
        }
    }
    return neighbors;
}

export function lateralNeighbors(map: Map2D<unknown>, [row, col]: Coordinate): Coordinate[] {
    const neighbors: Coordinate[] = [];

    if (row - 1 >= 0) {
        neighbors.push([row - 1, col]);
    }
    if (row + 1 < map.length) {
        neighbors.push([row + 1, col]);
    }

    if (col - 1 >= 0) {
        neighbors.push([row, col - 1]);
    }
    if (col + 1 < map[row].length) {
        neighbors.push([row, col + 1]);
    }

    return neighbors;
}

export function locateAllInstances<V>(map: Map2D<V>, val: V): Coordinate[] {
    const instances: Coordinate[] = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const pos: Coordinate = [row, col];
            if (lookup2D(map, pos) == val) {
                instances.push(pos);
            }
        }
    }
    
    return instances;
}

export function coordEquiv(a: Coordinate, b: Coordinate): boolean {
    return a[0] == b[0] && a[1] == b[1];
}

type Condition<V> = (v: V) => boolean;
/**
 * Runs a test on a value and returns a different value if the test passes or the same value
 * @param valToBeTested 
 * @param condition 
 * @param valIfCondition 
 * @returns 
 */
export function ifTest<V extends string | number>(valToBeTested: V, condition: Condition<V>, valIfCondition: V | ((o: V) => V)) {
    if (condition(valToBeTested)) {
        if (typeof valIfCondition == 'function') {
            return valIfCondition(valToBeTested);
        } else {
            return valIfCondition;
        }
    } else {
        return valToBeTested;
    }
}

export function equals<B, A extends B>(b: B): Condition<A> {
    return (a: A) => a == b;
}

export function equalsAny<B, A extends B>(...b: B[]): Condition<A> {
    return (a: A) => b.includes(a);
}

export function call<A, B, R>(f: (a: A, b: B) => R, b: B): (a: A) => R {
    return (a: A) => f(a, b);
}

export function not(f: (...args: unknown[]) => boolean) {
    return (...args: unknown[]) => !f(...args);
}

export function backtrack<T>(backtrackMap: Map<T, T>, endPos: T): T[] {
  const path: T[] = [];
  let thisPos = endPos;

  do {
    path.push(thisPos);

    thisPos = backtrackMap.get(thisPos);

  } while (thisPos);

  return path;
}

export function* pairIterator<T>(a: T[], b: T[]) {
    if (a.length !== b.length) {
        throw 'Lengths do not match';
    }

    for (let i = 0; i < a.length; i++) {
        yield <Pair<T>>[a[i], b[i]];
    }
}

export function coerceToList<T>(a: T | T[]) {
    if (a instanceof Array) {
        return a;
    } else {
        return [a];
    }
}

export enum LateralDirection {
    EQUIV,
    LEFT,
    RIGHT,
    DOWN,
    UP,
}

export function getDirection(from: Coordinate, to: Coordinate): LateralDirection {
    if (from[1] == to[1]) {
        if (from[0] > to[0]) {
            return LateralDirection.LEFT;
        } else if (from[0] < to[0]) {
            return LateralDirection.RIGHT;
        } else {
            return LateralDirection.EQUIV;
        }
    } else if (from[0] == to[0]) {
        if (from[1] > to[1]) {
            return LateralDirection.DOWN;
        } else if (from[1] < to[1]) {
            return LateralDirection.UP;
        } else {
            return LateralDirection.EQUIV;
        }
    } else {
        return undefined;
    }
}

export function swapValues<T>(a: T, b: T): (v: T) => T {
    return (v: T) => v === a ? b : v === b ? a : v;
}

export type MinMax = {
    min: number;
    max: number;
}
