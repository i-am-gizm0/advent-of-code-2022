import Puzzle from '../../types/AbstractPuzzle';

function parseInput(input: string) {
  return input.split('\n').map(line => line.split('').map(v => parseInt(v)));
}

function isVisible(height: number, heights: number[][], rowIdx: number, colIdx: number) {
  // Loop through each direction
  // If any directions have no elements taller than `height`, return true
  if (colIdx == 0 || colIdx == heights[0].length - 1 || rowIdx == 0 || rowIdx == heights.length - 1) {
    return true;
  }
  let allShorterLeft = true;
  for (let x = 0; x < colIdx; x++) {
    if (heights[rowIdx][x] >= height) {
      allShorterLeft = false;
      break;
    }
  }
  let allShorterRight = true;
  for (let x = colIdx + 1; x < heights[0].length; x++) {
    if (heights[rowIdx][x] >= height) {
      allShorterRight = false;
      break;
    }
  }
  let allShorterTop = true;
  for (let y = 0; y < rowIdx; y++) {
    if (heights[y][colIdx] >= height) {
      allShorterTop = false;
      break;
    }
  }
  let allShorterBottom = true;
  for (let y = rowIdx + 1; y < heights.length; y++) {
    if (heights[y][colIdx] >= height) {
      allShorterBottom = false;
      break;
    }
  }
  return allShorterLeft || allShorterRight || allShorterTop || allShorterBottom;
}

function getScenicScore (height: number, heights: number[][], rowIdx: number, colIdx: number) {
  // In each direction, get the distance to the edge or the first tree of at least the same height
  let countLeft = 0;
  for (let x = colIdx - 1; x >= 0; x--) {
    if (heights[rowIdx][x] >= height || x == 0) {
      countLeft = colIdx - x;
      break;
    }
  }
  let countRight = 0;
  for (let x = colIdx + 1; x < heights[rowIdx].length; x++) {
    if (heights[rowIdx][x] >= height || x == heights[rowIdx].length - 1) {
      countRight = x - colIdx;
      break;
    }
  }
  let countTop = 0;
  for (let y = rowIdx - 1; y >= 0; y--) {
    if (heights[y][colIdx] >= height || y == 0) {
      countTop = rowIdx - y;
      break;
    }
  }
  let countBottom = 0;
  for (let y = rowIdx + 1; y < heights.length; y++) {
    if (heights[y][colIdx] >= height || y == heights.length - 1) {
      countBottom = y - rowIdx;
      break;
    }
  }
  // console.log({rowIdx, colIdx, countLeft, countRight, countTop, countBottom});
  return countLeft * countRight * countTop * countBottom;
}


export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const heights = parseInput(this.input);

    const visibleArray = heights.map((row, rowIndex) => row.map((height, colIndex) => isVisible(height, heights, rowIndex, colIndex)));

    return visibleArray.flatMap(row => row.map(b => <number>(b ? 1 : 0))).reduce((a,b)=>a+b).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '21';
  }

  public solveSecond(): string {
    const heights = parseInput(this.input);
    // console.log({heights});

    const scenicScores = heights.map((row, rowIndex) => row.map((height, colIndex) => getScenicScore(height, heights, rowIndex, colIndex)));

    let flatScores: number[] = [];
    scenicScores.forEach(row => {
      flatScores = [...flatScores, ...row];
    });

    const sortedScores = flatScores.sort((a,b)=>b-a);
    // console.log({sortedScores});
    return sortedScores[0].toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '8';
  }
}
