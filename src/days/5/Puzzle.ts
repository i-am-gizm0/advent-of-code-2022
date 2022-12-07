import Puzzle from '../../types/AbstractPuzzle';

type Stack = string[];
type Move = {
  quantity: number,
  from: number,
  to: number
};

type Input = {
  stacks: Stack[],
  moves: Move[]
}

function parseInput(input: string): Input {
  const [stackString, moveString] = input.split('\n\n');

  const stackLines = stackString.split('\n');
  const stackCount = parseInt(stackLines.at(-1).trimEnd().slice(stackLines.at(-1).trimEnd().lastIndexOf(' ') + 1));
  const stacks: Stack[] = Array(stackCount);
  for (let i = 0; i < stacks.length; i++) {
    stacks[i] = [];
  }
  for (let lineNum = stackLines.length - 2; lineNum >=0; lineNum--) {
    const line = stackLines[lineNum];

    for (let stackNum = 0; stackNum < stackCount; stackNum++) {
      const char = line.charAt(1 + stackNum*4);
      if (char !== ' ') {
        stacks[stackNum].push(char);
      }
    }
  }
  // console.log({stackLines, stacks});

  const moveLines = moveString.split('\n');
  const moves = moveLines.map(line => {
    const [_, quantString, fromString, toString] = line.match(/move (\d+) from (\d+) to (\d+)/);
    return {
      quantity: parseInt(quantString),
      from: parseInt(fromString),
      to: parseInt(toString)
    };
  });


  return { stacks, moves };
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const {stacks, moves} = parseInput(this.input);
    // console.log({stacks, moves});

    for (const move of moves) {
      for (let i = 0; i < move.quantity; i++) {
        stacks[move.to - 1].push(stacks[move.from - 1].pop());
      }

      // console.log({move, stacks});
    }

    return stacks.map(stack => stack.pop()).join('');
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'CMZ';
  }

  public solveSecond(): string {
    const {stacks, moves} = parseInput(this.input);
    // console.log({stacks, moves});

    for (const move of moves) {
      const cratesToMove = [];
      for (let i = 0; i < move.quantity; i++) {
        cratesToMove.push(stacks[move.from - 1].pop());
      }
      stacks[move.to - 1].push(...cratesToMove.reverse());

      // console.log({move, stacks});
    }

    return stacks.map(stack => stack.pop()).join('');
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'MCD';
  }
}
