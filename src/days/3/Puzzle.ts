import Puzzle from '../../types/AbstractPuzzle';

type RucksackHalves = [string, string];

function splitAt(str: string, idx: number): RucksackHalves {
  return [str.slice(0, idx), str.slice(idx)];
}

function splitInMiddle(str: string): RucksackHalves {
  return splitAt(str, Math.floor(str.length / 2));
}

function parseRucksackHalves(input: string): RucksackHalves[] {
  return input.split('\n').map(splitInMiddle);
}

function isFirstOccurence<T>(val: T, index: number, array: T[]) {
  return array.indexOf(val) == index;
}

function findRepeatedLetter(strings: string[]): string {
  const lettersOccur: {[key: string]: number[]} = {};

  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];
    const chars = string.split('').filter(isFirstOccurence);

    for (const char of chars) {
      if (!(char in lettersOccur)) {
        lettersOccur[char] = [];
      }
      if (char in lettersOccur) {
        lettersOccur[char].push(i);
      }
    }
  }

  return Object.entries(lettersOccur).find(entry => {
    const numbers = entry[1];
    for (let i = 0; i < strings.length; i++) {
      if (!(i in numbers)) {
        return false;
      }
    }
    return true;
  })[0];

  // for (const string of strings) {
  //   const chars = string.split('').filter(isFirstOccurence);

  //   for (const char of chars) {
  //     lettersOccur[char] = char in lettersOccur;
  //   }
  // }

  // console.log({strings, lettersOccur});

  // return Object.entries(lettersOccur).find(entry => entry[1])[0];
}

function letterPriority(char: string): number {
  const charCode = char.charCodeAt(0);

  if (charCode >= 96 && charCode <= 122) {
    return charCode - 96;
  } else if (charCode >= 65 && charCode <= 90) {
    return charCode - 38;
  } else {
    return 0;
  }
}

function groupToThrees(input: string) {
  const lines = input.split('\n');
  let group: string[] = [];
  const groups: [string, string, string][] = [];

  for (let i = 0; i <= lines.length; i++) {
    if (i != 0 && i % 3 == 0) {
      groups.push(<[string, string, string]>group);
      group = [];
      if (i == lines.length) {
        break;
      }
    }

    group.push(lines[i]);
  }

  return groups;
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const rucksacks = parseRucksackHalves(this.input);

    const repeatedLetters = rucksacks.map(findRepeatedLetter);

    // console.log(repeatedLetters);

    const allPriorities = repeatedLetters.map(letterPriority);

    // console.log(allPriorities);
    
    return allPriorities.reduce((a,b)=>a+b).toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '157';
  }

  public solveSecond(): string {
    const groups = groupToThrees(this.input);
    const repeats = groups.map(findRepeatedLetter);
    console.log({groups, repeats});

    return repeats.map(letterPriority).reduce((a,b)=>a+b).toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '70';
  }
}
