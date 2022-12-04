import Puzzle from '../../types/AbstractPuzzle';

type Pair<T> = [T, T];
type Str<T extends string | number | bigint | boolean> = `${T}`;

function parseInput(input: string): Pair<Pair<number>>[] {
  return input.split('\n').map((line: `${number}-${number},${number}-${number}`) =>
    (<Pair<Pair<number>>> (<Pair<`${number}-${number}`>>
    line.split(',')).map(elf =>
      (<Pair<number>> (<Pair<Str<number>>>
      elf.split('-')).map(num => parseInt(num))
      )
    )
    )
  );
}

/**
 * Checks whether `a` includes `b`
 * @param a The theoretically larger range
 * @param b The theoretically smaller range
 * @returns whether `b` fits within the range defined by `a`
 */
function includes(a: Pair<number>, b: Pair<number>): boolean {
  return a[0] <= b[0] && a[1] >= b[1];
}

/**
 * Checks whether `a` includes `b` or `b` includes `a`
 */
function biDirectionalIncludes(a: Pair<number>, b: Pair<number>): boolean {
  return includes(a, b) || includes(b, a);
}

function countContainingPairs(pairs: Pair<Pair<number>>[]): number {
  return pairs.filter(pair => biDirectionalIncludes(...pair)).length;
}

function doesOverlap(a: Pair<number>, b: Pair<number>): boolean {
  return (a[0] <= b[1] && a[1] >= b[0]) || (b[0] <= a[1] && b[1] >= a[0]);
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const pairs = parseInput(this.input);
    return countContainingPairs(pairs).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '2';
  }

  public solveSecond(): string {
    const pairs = parseInput(this.input);
    return pairs.filter(pair => doesOverlap(...pair)).length.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '4';
  }
}
