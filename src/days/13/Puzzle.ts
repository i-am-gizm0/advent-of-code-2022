import { coerceToList, notFalsy, Pair, sum } from '../../gizm0-utils/utils';
import Puzzle from '../../types/AbstractPuzzle';

type Packet = Packet[] | number | undefined;

function parseInput(input: string): Pair<Packet[]>[] {
  return input.split('\n\n').map(lines =>
    <Pair<Packet[]>>lines.split('\n').filter(notFalsy).map(line => 
      JSON.parse(line)
    )
  );
}

/**
 * 
 * @returns true/false whether or not the packets are in the right order or undefiend if it cannot be determined
 */
function evaluateOrder(left: Packet, right: Packet): boolean {
  // console.log('Compare', left, 'vs', right);
      
  if (typeof left === 'number' && typeof right === 'number') {
    if (left === right) {
      return undefined;
    } else {
      const result = left < right;
      // console.log(`Inputs are in the ${result ? 'right' : 'wrong'} order`);
      return result;
    }
  } else if (left instanceof Array && right instanceof Array) {
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      if (!(i in left)) {
        // console.log('Left ran out - right order');
        return true;
      }
      if (!(i in right)) {
        // console.log('Right ran out - wrong order');
        return false;
      }
      const decision = evaluateOrder(left[i], right[i]);
      if (decision !== undefined) {
        return decision;
      }
    }
  } else {
    return evaluateOrder(coerceToList(left), coerceToList(right));
  }
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const input = parseInput(this.input);

    const rightOrderedPackets = input.map((pair, i) => evaluateOrder(...pair) ? i + 1 : undefined).filter(notFalsy);

    // console.log({rightOrderedPackets});

    // WRITE SOLUTION FOR TEST 1
    return rightOrderedPackets.reduce(sum).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '13';
  }

  public solveSecond(): string {
    const input = parseInput(this.input);

    const allPackets = [...input.flat(), [[2]], [[6]]];

    const sortedPackets = allPackets.sort((...pair) => evaluateOrder(...pair) ? -1 : 1);

    // sortedPackets.forEach(packet => console.log(packet));

    const indexDiv2 = sortedPackets.findIndex(packet => {
      try {
        // @ts-expect-error try/catch handles this
        return packet[0][0] === 2;
      } catch {
        return false;
      }
    }) + 1;
    
    const indexDiv6 = sortedPackets.findIndex(packet => {
      try {
        // @ts-expect-error try/catch handles this
        return packet[0][0] === 6;
      } catch {
        return false;
      }
    }) + 1;


    // WRITE SOLUTION FOR TEST 2
    return (indexDiv2 * indexDiv6).toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '140';
  }
}
