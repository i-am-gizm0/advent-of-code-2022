import Puzzle from '../../types/AbstractPuzzle';

enum InstructionType {
  NOOP = 1,
  ADDX = 2
}

interface BaseInstruction {
  type: InstructionType;
}

interface NoOpInstruction extends BaseInstruction {
  type: InstructionType.NOOP;
}

interface AddXInstruction extends BaseInstruction {
  type: InstructionType.ADDX;
  value: number;
}

type Instruction = NoOpInstruction | AddXInstruction;

function parseInput(input: string): Instruction[] {
  return input.split('\n').slice(0,-1).map(instruction => {
    if (instruction == 'noop') {
      return <NoOpInstruction> {
        type: InstructionType.NOOP
      };
    } else if (instruction.startsWith('addx ')) {
      return <AddXInstruction> {
        type: InstructionType.ADDX,
        value: parseInt(instruction.slice(5))
      };
    }
  });
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const instructions = parseInput(this.input);

    // console.log(instructions);

    let tick = 0;
    let ticksRemaining = 0;
    let currentInstruction: Instruction;
    let X = 1;
    let strengthSum = 0;
    let lastSumTick = undefined;
    while (instructions.length || ticksRemaining >= 0) {
      if ((tick - 20) % 40 == 0 && lastSumTick != tick) {
        const signalStrength = tick * X;
        strengthSum += signalStrength;
        // console.log(`Tick ${tick}: Added ${signalStrength} to sum... now ${strengthSum}`);
        lastSumTick = tick;
      }

      if (ticksRemaining == 0) {
        if (currentInstruction?.type == InstructionType.ADDX) {
          X += currentInstruction.value;
          // console.log(`Finished ADDX... X = ${X}`);
        }

        currentInstruction = instructions.shift();

        ticksRemaining = currentInstruction?.type;

        // console.log(`Read instruction ${InstructionType[currentInstruction?.type]}`);
      } else {
        tick++;
        // console.group(`tick ${tick}`);
        ticksRemaining--;

        // console.log({X});

        // console.groupEnd();
      }
    }

    return strengthSum.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '13140';
  }

  public solveSecond(): string {
    const instructions = parseInput(this.input);

    const display: boolean[] = Array(240).fill(false);

    // console.log(instructions);

    let tick = 0;
    let ticksRemaining = 0;
    let currentInstruction: Instruction;
    let X = 1;
    let lastUpdateTick = 0;
    while (instructions.length || ticksRemaining >= 0) {
      if (lastUpdateTick != tick) {
        if (Math.abs((tick - 1) % 40 - X) <= 1) {
          display[tick - 1] = true;
        }

        console.log('row   ', display.slice(Math.floor(tick / 40) * 40, Math.floor(tick / 40) * 40 + (tick % 40)).map(v => v ? '#' : '.').join(''));

        lastUpdateTick = tick;
      }

      if (ticksRemaining == 0) {
        if (currentInstruction?.type == InstructionType.ADDX) {
          X += currentInstruction.value;
          // console.log(`Finished ADDX... X = ${X}`);
        }
        console.log('sprite', Array(40).fill(0).map((_, i) => Math.abs(i - X) <= 1 ? '#' : '.').join(''));

        currentInstruction = instructions.shift();

        ticksRemaining = currentInstruction?.type;

        // console.log(`Read instruction ${InstructionType[currentInstruction?.type]}`);
      } else {
        tick++;
        console.log(`tick ${tick}:`, {X});
        ticksRemaining--;
      }
    }

    let output = '';
    for (let i = 0; i < display.length; i++) {
      if (i % 40 == 0) {
        output += '\n';
      }
      output += display[i] ? '#' : '.';
    }

    return output;

  }

  public getSecondExpectedResult(): string {
    return `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`;
  }
}
