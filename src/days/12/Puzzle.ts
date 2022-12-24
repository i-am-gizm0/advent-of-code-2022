import Puzzle from '../../types/AbstractPuzzle';
import { call, coordEquiv, Coordinate, equalsAny, lateralNeighbors, ifTest, locate2D, lookup2D, notFalsy, not, backtrack, locateAllInstances } from '../gizm0-utils/utils';

enum SpecialPosition {
  START = 'S',
  END = 'E'
}

type ElevationMap = (number | SpecialPosition)[][];

function parseInput(input: string): ElevationMap {
  const rawMap: string[][] = input.split('\n').filter(notFalsy).map(line => line.split(''));

  const numMap = rawMap.map(row => row.map(val => {
    switch (val) {
      case 'S':
        return SpecialPosition.START;
      case 'E':
        return SpecialPosition.END;
      default:
        return val.charCodeAt(0) - 97;
    }
  }));

  return numMap;
}


function accessible(map: ElevationMap, currentHeight: number, maxDelta = 1): (c: Coordinate) => boolean {
  return ([row, col]: Coordinate): boolean => {
    const heightAtPos = map[row][col];
    if (heightAtPos == SpecialPosition.END) {
      return currentHeight == 25;
    } else if (heightAtPos == SpecialPosition.START) {
      return true;
    }
    return heightAtPos - currentHeight <= maxDelta;
  };
}

function prettyPrintMap(map: ElevationMap) {
  for (const row of map) {
    console.log(
      row.map(v =>
        typeof v == 'number' ? String.fromCharCode(v + 97) : v
      ).join('')
    );
  }
}

function BFSFromAToB(startPos: Coordinate, endPos: Coordinate, map: ElevationMap): Coordinate[] | undefined {
  const queue: Coordinate[] = [startPos];
  const backtrackMap = new Map<Coordinate, Coordinate>();

  let thisPos: Coordinate;
  let foundPath = false;

  console.time(`BFS`);
  while (queue.length) {
    // console.log({queue});
    thisPos = queue.shift();
    if (coordEquiv(thisPos, endPos)) {
      foundPath = true;
      break;
    }

    // const thisHeight = lookup2D(map, thisPos) == SpecialPosition.START ? 0 : lookup2D(map, thisPos);
    const thisHeight = <number>ifTest(
      lookup2D(map, thisPos),
      equalsAny(SpecialPosition.START, SpecialPosition.END),
      0
    );

    const accessibleNeighbors = lateralNeighbors(map, thisPos)
                                  .filter(
                                    accessible(map, thisHeight)
                                  );

    // console.log(`Position`, thisPos, `has accessible neighbors`, accessibleNeighbors);

    const firstVisitNeighbors = accessibleNeighbors.filter(
      neighbor => [...backtrackMap.keys()].every(
        not(call(coordEquiv, neighbor))
      )
    );
    firstVisitNeighbors.forEach(newPos => backtrackMap.set(newPos, thisPos));
    queue.push(...firstVisitNeighbors);
  }

  console.timeEnd(`BFS`);

  if (!foundPath) {
    return undefined;
  }

  // console.log({foundPath});

  console.time('Backtrack');
  const path = backtrack(backtrackMap, thisPos);
  console.timeEnd('Backtrack');

  return path;
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const map = parseInput(this.input);
    const startPos = locate2D(map, SpecialPosition.START);
    const endPos = locate2D(map, SpecialPosition.END);

    // Implement a BFS with backtracking of neighbors of the current position.
    prettyPrintMap(map);

    // console.log({startPos, endPos});

    const path = BFSFromAToB(startPos, endPos, map);

    // console.log({path});

    // path.reverse().forEach((pos, seq) => console.log(`${seq}:`, pos, lookup2D(map, pos)));
    

    // WRITE SOLUTION FOR TEST 1
    return (path.length - 1).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '31';
  }

  public solveSecond(): string {
    const map = parseInput(this.input);
    const endPos = locate2D(map, SpecialPosition.END);

    // Implement a BFS with backtracking of neighbors of the current position.
    prettyPrintMap(map);

    console.time('Locate all starting positions');
    const allStarts = [locate2D(map, SpecialPosition.START), ...locateAllInstances(map, 0)];
    console.timeEnd('Locate all starting positions');
    console.log(`Number of starting positions: ${allStarts.length}`);

    let shortestPath: Coordinate[];
    let successfulPathCount = 0;

    console.time('Calculate all paths');
    allStarts.forEach(startPos => {
      const path = BFSFromAToB(startPos, endPos, map);

      if (path) {
        successfulPathCount++;
        if (!shortestPath || path.length < shortestPath.length) {
          shortestPath = path;
          console.log(`> Shortest path: ${path.length - 1}`);
        }
      }
    });
    console.timeEnd('Calculate all paths');
    console.log(`Successful paths: ${successfulPathCount}/${allStarts.length}`);

    return (shortestPath.length - 1).toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '29';
  }
}
