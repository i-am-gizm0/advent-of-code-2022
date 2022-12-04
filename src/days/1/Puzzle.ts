import Puzzle from '../../types/AbstractPuzzle';

function getSortedCaloriesInOrder(input: string): number[] {
  return input.split('\n\n')
    .map(elfString =>
      elfString.split('\n')
        .map(s => parseInt(s))
        .reduce((a,b) => a+b)
    ).sort((a,b) => b-a);
}

export default class ConcretePuzzle extends Puzzle {

  public solveFirst(): string {
    return getSortedCaloriesInOrder(this.input)[0].toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '24000';
  }

  public solveSecond(): string {
    // console.log(getSortedCaloriesInOrder(this.input));

    return getSortedCaloriesInOrder(this.input).slice(0, 3).reduce((a,b)=>a+b).toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '45000';
  }
}
