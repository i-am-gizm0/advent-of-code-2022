import Puzzle from '../../types/AbstractPuzzle';
import { mult, o, shiftIterator } from '../../gizm0-utils/utils';

type WorryLevel = number;
type Operand = number | 'old';

abstract class Operation {
  protected operand1: Operand;
  protected operand2: Operand;

  public constructor(operand1: Operand, operand2: Operand) {
    this.operand1 = operand1;
    this.operand2 = operand2;
  }

  public abstract call(old: number): number;

  protected replaceOld(operand: Operand, old: number): number {
    return operand == 'old' ? old : operand;
  }

  public static fromString(str: string): Operation {
    const matchResults = str.match(/^(\d+|old) ([*+]) (\d+|old)$/);
    const operand1 = (<'old' | `${number}`>matchResults[1]) == 'old' ? 'old' : parseInt(matchResults[1]);
    const operator = <'*' | '+'>matchResults[2];
    const operand2 = (<'old' | `${number}`>matchResults[3]) == 'old' ? 'old' : parseInt(matchResults[3]);

    switch (operator) {
      case '*':
        return new MultiplyOperation(operand1, operand2);
      case '+':
        return new AddOperation(operand1, operand2);
      default:
        throw `Unknown operator ${operator} in ${str}`;
    }
  }
}

class MultiplyOperation extends Operation {
  public call(old: number): number {
    const val = this.replaceOld(this.operand1, old) * this.replaceOld(this.operand2, old);
    // console.log(`Worry level is multiplied to ${val}`);
    return val;
  }
}

class AddOperation extends Operation {
  public call(old: number): number {
    const val = this.replaceOld(this.operand1, old) + this.replaceOld(this.operand2, old);
    // console.log(`Worry level is increased to ${val}`);
    return val;
  }
}

abstract class Test<Action> {
  protected trueAction: Action;
  protected falseAction: Action;

  public constructor(trueAction: Action, falseAction: Action) {
    this.trueAction = trueAction;
    this.falseAction = falseAction;
  }

  public abstract call(value: number): boolean;


  public getAction(value: number): Action {
    return this.call(value) ? this.trueAction : this.falseAction;
  }

  public static fromString(test: string, trueAction: string, falseAction: string) {
    const divisibleResults = test.match(/^divisible by (\d+)$/);
    if (divisibleResults) {
      return new DivisibleTest(parseInt(divisibleResults[1]), parseInt(trueAction.slice(29)), parseInt(falseAction.slice(30)));
    } else {
      throw 'Unknown test';
    }
  }
}
class DivisibleTest<Action> extends Test<Action> {
  private divisor: number;
  public constructor(divisor: number, trueAction: Action, falseAction: Action) {
    super(trueAction, falseAction);
    this.divisor = divisor;
  }

  public call(value: number): boolean {
      const result = value % this.divisor == 0;
      // console.log(`Current worry level is${result ? '' : ' not'} divisible by ${this.divisor}`);
      return result;
  }
}

class Monkey {
  items: WorryLevel[];
  operation: Operation;
  test: Test<number>;
  itemsInspected = 0;

  constructor(items: WorryLevel[], operation: Operation, test: Test<number>) {
    this.items = items;
    this.operation = operation;
    this.test = test;
  }
}

function parseInput(input: string): Monkey[] {
  return input.split('\n\n').map(monkeyString => {
    const [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      numberLine,
      itemsLine,
      operationLine,
      testLine,
      trueLine,
      falseLine
    ] = monkeyString.split('\n');

    const items: WorryLevel[] = itemsLine.slice(18).split(', ').map(o(parseInt));

    const operation = Operation.fromString(operationLine.slice(19));

    const test = Test.fromString(testLine.slice(8), trueLine, falseLine);
  
    return new Monkey(items, operation, test);
  });
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const monkeys = parseInput(this.input);

    // console.log(monkeys);

    const ROUNDS = 20;

    // A round is when each monkey gets a turn
    for (let round = 1; round <= ROUNDS; round++) {
      // console.group(`Round ${round}`);
      // Each monkey takes a turn to inspect of its items
      for (let indexMonkey = 0; indexMonkey < monkeys.length; indexMonkey++) {
        // console.group(`Monkey ${indexMonkey}`);

        const monkey = monkeys[indexMonkey];

        for (let worryLevel of shiftIterator(monkey.items)) {
          // console.group(`Monkey inspects an item with a worry level of ${worryLevel}.`);

          worryLevel = monkey.operation.call(worryLevel);
          monkey.itemsInspected++;

          worryLevel = Math.floor(worryLevel / 3);
          // console.log(`Monkey gets bored with item. Worry level is divided by 3 to ${worryLevel}`);

          const action = monkey.test.getAction(worryLevel);

          // console.log(`Item is thrown to monkey ${action}`);

          monkeys[action].items.push(worryLevel);

          // console.groupEnd();
        }

        // console.groupEnd();
      }
      // console.groupEnd();
    }

    // console.log(monkeys);

    const monkeyBusiness = monkeys.map(monkey => monkey.itemsInspected).sort((a,b)=>a-b).slice(-2).reduce(mult, 1);
    
    return monkeyBusiness.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '10605';
  }

  public solveSecond(): string {
    const monkeys = parseInput(this.input);

    // console.log(monkeys);

    const ROUNDS = 10000;

    // A round is when each monkey gets a turn
    for (let round = 1; round <= ROUNDS; round++) {
      // console.group(`Round ${round}`);
      // Each monkey takes a turn to inspect of its items
      for (let indexMonkey = 0; indexMonkey < monkeys.length; indexMonkey++) {
        // console.group(`Monkey ${indexMonkey}`);

        const monkey = monkeys[indexMonkey];

        for (let worryLevel of shiftIterator(monkey.items)) {
          // console.group(`Monkey inspects an item with a worry level of ${worryLevel}.`);

          worryLevel = monkey.operation.call(worryLevel);
          monkey.itemsInspected++;

          const action = monkey.test.getAction(worryLevel);

          // console.log(`Item is thrown to monkey ${action}`);

          monkeys[action].items.push(worryLevel);

          // console.groupEnd();
        }

        // console.groupEnd();
      }
      if (round == 1 || round == 20 || round % 1000 == 0) {
        console.group(`== After round ${round} ==`);
        for (let i = 0; i < monkeys.length; i++) {
          console.log(`Monkey ${i} inspected items ${monkeys[i].itemsInspected} times.`);
        }
        console.groupEnd();
        console.log();
      }
      // console.groupEnd();
    }

    // console.log(monkeys);

    const monkeyBusiness = monkeys.map(monkey => monkey.itemsInspected).sort((a,b)=>a-b).slice(-2).reduce(mult, 1);
    
    return monkeyBusiness.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
