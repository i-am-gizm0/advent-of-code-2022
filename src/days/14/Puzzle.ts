import { Coordinate, getDirection, LateralDirection, MinMax, o, swapValues } from '../../gizm0-utils/utils';
import Puzzle from '../../types/AbstractPuzzle';

enum MapEntity {
  ROCK,
  SAND
};

type Data = {
  x: MinMax;
  y: MinMax;
}

const STARTING_POINT: Coordinate = [500, 0];

function parseInput(input: string) {
  const map = new Map<string, MapEntity>();
  const data: Data = {
    x: {
      min: undefined,
      max: undefined,
    },
    y: {
      min: undefined,
      max: undefined
    }
  };

  input.split('\n').forEach(path => {
    const points = <Coordinate[]>path
      .split(' -> ')
      .map(point =>
        point.split(',').map(o(parseInt))
      );
    for (let i = 1; i < points.length; i++) {
      const pointA = points[i - 1];
      const pointB = points[i];
      // console.log('Adding segment from', pointA, 'to', pointB);
      {
        if (data.x.min === undefined || pointA[0] < data.x.min) {
          data.x.min = pointA[0];
        }
        if (data.x.min === undefined || pointB[0] < data.x.min) {
          data.x.min = pointB[0];
        }
        if (data.x.max === undefined || pointA[0] > data.x.max) {
          data.x.max = pointA[0];
        }
        if (data.x.max === undefined || pointB[0] > data.x.max) {
          data.x.max = pointB[0];
        }

        if (data.y.min === undefined || pointA[1] < data.y.min) {
          data.y.min = pointA[1];
        }
        if (data.y.min === undefined || pointB[1] < data.y.min) {
          data.y.min = pointB[1];
        }
        if (data.y.max === undefined || pointA[1] > data.y.max) {
          data.y.max = pointA[1];
        }
        if (data.y.max === undefined || pointB[1] > data.y.max) {
          data.y.max = pointB[1];
        }
      }

      const direction = swapValues(LateralDirection.DOWN, LateralDirection.UP)(getDirection(pointA, pointB));
      switch (direction) {
        case LateralDirection.LEFT:
          for (let x = pointB[0]; x <= pointA[0]; x++) {
            map.set(`${[x, pointA[1]]}`, MapEntity.ROCK);
          }
          break;
        case LateralDirection.RIGHT:
          for (let x = pointA[0]; x <= pointB[0]; x++) {
            map.set(`${[x, pointA[1]]}`, MapEntity.ROCK);
          }
          break;
        case LateralDirection.UP:
          for (let y = pointB[1]; y <= pointA[1]; y++) {
            map.set(`${[pointA[0], y]}`, MapEntity.ROCK);
          }
          break;
        case LateralDirection.DOWN:
          for (let y = pointA[1]; y <= pointB[1]; y++) {
            map.set(`${[pointA[0], y]}`, MapEntity.ROCK);
          }
          break;
      }
    }
  });

  return { map, data };
}

function prettyPrintMap(map: Map<string, MapEntity>, data: Data, yBuffer = 0) {
  for (let y = 0; y <= data.y.max + yBuffer; y++) {
    let line = '';
    for (let x = data.x.min; x <= data.x.max; x++) {
      if (x == 500 && y == 0) {
        line += '+';
        continue;
      }
      const point = map.get(`${[x, y]}`);
      line += point === MapEntity.ROCK ? '#' : point === MapEntity.SAND ? 'o' : '.';
    }
    console.log(line);
  }
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const { map, data } = parseInput(this.input);

    prettyPrintMap(map, data);

    let grainCount = 0;

    // Loop until grains start falling into the abyss
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let cameToRest = false;

      const position: Coordinate = [...STARTING_POINT];

      // Loop until the grain falls into the abyss
      while (position[1] <= data.y.max) {
        const bottomLeftFree = map.get(`${[position[0] - 1, position[1] + 1]}`) !== undefined ? false : true;
        const bottomFree = map.get(`${[position[0], position[1] + 1]}`) !== undefined ? false : true;
        const bottomRightFree = map.get(`${[position[0] + 1, position[1] + 1]}`) !== undefined ? false : true;

        if (bottomFree) {
          position[1]++;
          continue;
        }

        if (bottomLeftFree) {
          position[0]--;
          position[1]++;
        } else if (bottomRightFree) {
          position[0]++;
          position[1]++;
        } else {
          cameToRest = true;
          map.set(`${position}`, MapEntity.SAND);
          break;
        }
      }

      // prettyPrintMap(map, data);

      if (cameToRest) {
        grainCount++;
      } else {
        break;
      }
    }

    prettyPrintMap(map, data);

    // WRITE SOLUTION FOR TEST 1
    return grainCount.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '24';
  }

  public solveSecond(): string {
    const { map, data } = parseInput(this.input);

    prettyPrintMap(map, data);

    let grainCount = 0;

    // Loop until grains start falling into the abyss
    // eslint-disable-next-line no-constant-condition
    while (map.get('500,0') === undefined) {
      let cameToRest = false;

      const position: Coordinate = [...STARTING_POINT];

      // Loop until the grain falls into the abyss
      while (position[1] <= data.y.max + 2) {
        const bottomLeftFree = (map.get(`${[position[0] - 1, position[1] + 1]}`) !== undefined ? false : true) && position[1] < data.y.max + 1;
        const bottomFree = (map.get(`${[position[0], position[1] + 1]}`) !== undefined ? false : true) && position[1] < data.y.max + 1;
        const bottomRightFree = (map.get(`${[position[0] + 1, position[1] + 1]}`) !== undefined ? false : true) && position[1] < data.y.max + 1;

        if (bottomFree) {
          position[1]++;
          continue;
        }

        if (bottomLeftFree) {
          position[0]--;
          position[1]++;
        } else if (bottomRightFree) {
          position[0]++;
          position[1]++;
        } else {
          cameToRest = true;
          map.set(`${position}`, MapEntity.SAND);
          break;
        }
      }

      // prettyPrintMap(map, data);

      if (cameToRest) {
        grainCount++;
      } else {
        break;
      }
    }

    prettyPrintMap(map, data, 2);

    return grainCount.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '93';
  }
}
