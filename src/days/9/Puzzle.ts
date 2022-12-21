import Puzzle from '../../types/AbstractPuzzle';

function parseInput(input: string) {
  const headPosition: [number, number] = [0, 0];
  const deltas = input.split('\n').map(line => {
    const [_, dir, dist] = line.match(/([URDL]) (\d)/);
    const delta: [number, number] = [0, 0];

    switch (dir) {
      case 'U':
        delta[1] = parseInt(dist);
        break;
      
      case 'R':
        delta[0] = parseInt(dist);
        break;
      
      case 'D':
        delta[1] = -parseInt(dist);
        break;
      
      case 'L':
        delta[0] = -parseInt(dist);
        break;
    }

    headPosition[0] += delta[0];
    headPosition[1] += delta[1];

    return delta;
  });

  return deltas;
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const headDeltas = parseInput(this.input);

    let tailPosition: [number, number] = [0,0];
    const tailVisited: boolean[][] = [];

    headDeltas.forEach(([xDelta, yDelta]) => {
      if (xDelta) {
        if (xDelta > 0) {
          for (let xA = 0; xA < xDelta; xA++) {
            if (!tailVisited[xA + tailPosition[0]]) {
              
            }
            tailPosition[0]++;
          }
        } else {
          for (let xA = 0; xA > xDelta; xA--) {

          }
        }

      } else if (yDelta) {

      }
    })


    return 'day 1 solution 1';
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    return 'day 1 solution 2';
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
