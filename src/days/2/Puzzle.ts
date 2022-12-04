import Puzzle from '../../types/AbstractPuzzle';

type OpponentChar = 'A' | 'B' | 'C';
type PlayerChar = 'X' | 'Y' | 'Z';
type OutcomeChar = 'X' | 'Y' | 'Z';

enum Move {
  Rock = 1,
  Paper = 2,
  Scissors = 3
}
enum RoundResult {
  Loss = 0,
  Draw = 3,
  Win = 6
}

const moveDict = {
  A: Move.Rock,
  B: Move.Paper,
  C: Move.Scissors,
  X: Move.Rock,
  Y: Move.Paper,
  Z: Move.Scissors
};
const resultDict = {
  X: RoundResult.Loss,
  Y: RoundResult.Draw,
  Z: RoundResult.Win
};


function getMoves(input: string) {
  return <[Move, Move][]>(<`${OpponentChar} ${PlayerChar}`[]> input.split('\n'))
    .map(line =>
      (<[OpponentChar, PlayerChar]> line.split(' '))
        .map((move) => moveDict[move]));
}


function roundOutcome([opponentMove, playerMove]: [Move, Move]) {
  if ((playerMove == Move.Rock && opponentMove == Move.Scissors) || (playerMove - opponentMove > 0 && !(playerMove == Move.Scissors && opponentMove == Move.Rock))) {
    return RoundResult.Win;
  } else if (playerMove === opponentMove) {
    return RoundResult.Draw;
  } else {
    return RoundResult.Loss;
  }
}

const outcomeDict: [Move, Move, RoundResult][] = [
  [Move.Rock, Move.Rock, RoundResult.Draw],
  [Move.Rock, Move.Paper, RoundResult.Win],
  [Move.Rock, Move.Scissors, RoundResult.Loss],
  [Move.Paper, Move.Rock, RoundResult.Loss],
  [Move.Paper, Move.Paper, RoundResult.Draw],
  [Move.Paper, Move.Scissors, RoundResult.Win],
  [Move.Scissors, Move.Rock, RoundResult.Win],
  [Move.Scissors, Move.Paper, RoundResult.Loss],
  [Move.Scissors, Move.Scissors, RoundResult.Draw],
];

// for (const [opponentMove, playerMove, expectedOutcome] of outcomeDict) {
//   const outcome = roundOutcome([opponentMove, playerMove]);
//   if (outcome == expectedOutcome) {
//     console.log(`✅ ${Move[opponentMove]} vs ${Move[playerMove]}`);
//   } else {
//     console.log(`❌ ${Move[opponentMove]} vs ${Move[playerMove]}: ${RoundResult[outcome]} (expected ${RoundResult[expectedOutcome]})`);
//   }
// }


function getRounds(input: string) {
  return (<`${OpponentChar} ${OutcomeChar}`[]> input.split('\n'))
    .map(line => {
      return <[Move, RoundResult]> [moveDict[<OpponentChar> line.charAt(0)], resultDict[<OutcomeChar> line.charAt(2)]];
    });
}

function lookupPlayerMove([needleOpponentMove, needleResult]: [Move, RoundResult]): Move {
  try {
    return outcomeDict.find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([haystackOpponentMove, _, haystackResult]) =>
        haystackOpponentMove == needleOpponentMove && haystackResult == needleResult
    )[1];
  } catch (e) {
    const context = { needleOpponentMove, needleResult };
    console.error({context});
    throw e;
  }
}
// for (const [opponentMove, expectedMove, outcome] of outcomeDict) {
//   const playerMove = lookupPlayerMove([opponentMove, outcome]);

//   if (playerMove == expectedMove) {
//     console.log(`✅ ${Move[opponentMove]} vs ${Move[playerMove]}: ${RoundResult[outcome]}`);
//   } else {
//     console.log(`❌ ${Move[opponentMove]} vs ${Move[playerMove]}: ${RoundResult[outcome]} (expected ${Move[expectedMove]})`);
//   }
// }

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    let score = 0;

    const rounds = getMoves(this.input);

    // rounds.forEach(round => console.log(round));

    for (const round of rounds) {
      const choiceResult = round[1];
      const roundResult = roundOutcome(round);
      // console.log({choiceResult, roundResult});
      score += choiceResult + roundResult;
    }

    return score.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '15';
  }

  public solveSecond(): string {
    let score = 0;
    const rounds = getRounds(this.input);
    // console.log(rounds);

    for (const [opponentMove, result] of rounds) {
      const playerMove = lookupPlayerMove([opponentMove, result]);
      
      score += playerMove + result;
    }

    // WRITE SOLUTION FOR TEST 2
    return score.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '12';
  }
}
