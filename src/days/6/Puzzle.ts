import Puzzle from '../../types/AbstractPuzzle';

function findMarker(input: string, markerLength: number): number {
  for (let windowEndIndex = markerLength; windowEndIndex < input.length; windowEndIndex++) { // Slide a window through the full string
    const window = input.slice(windowEndIndex - markerLength, windowEndIndex);
    let allUnique = true;
    // console.log(window);
    for (let firstComparisonIndex = 0; firstComparisonIndex < window.length - 1; firstComparisonIndex++) {
      // console.log(`  ${window.charAt(firstComparisonIndex)}`);
      for (let secondComparisonIndex = firstComparisonIndex + 1; secondComparisonIndex < window.length; secondComparisonIndex++) {
        // console.log(`    ${window.charAt(secondComparisonIndex)}`);
        if (window.charAt(firstComparisonIndex) == window.charAt(secondComparisonIndex)) {
          allUnique = false;
          // console.log(`  ${window.charAt(firstComparisonIndex)} ${window.charAt(secondComparisonIndex)} are the same`);
          break;
        }
      }
      if (!allUnique) {
        break;
      }
    }
    if (allUnique) {
      return windowEndIndex;
    }
  }
  return undefined;
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return findMarker(this.input, 4).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '7';
  }

  public solveSecond(): string {
    return findMarker(this.input, 14).toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '19';
  }
}
