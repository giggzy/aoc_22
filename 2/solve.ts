#!/usr/bin/env -S ts-node
import fs from "fs";
import path from "path";

let elves_cals: number[] = [];
let current_total = 0;
const inputfile = path.join(__dirname, "input.txt");
const input = fs.readFileSync(inputfile, "utf8");

const opp_map = {
  A: "R",
  B: "P",
  C: "S",
};

class Move {
  score: number = 0;

  public getScore(): number {
    return this.score;
  }

  public isWin(move: Move): boolean {
    return false;
  }

  public isDraw(move: Move): boolean {
    return this.toString() === move.toString();
  }

  public get_winning_move(): Move {
    throw new Error("not implemented");
  }

  public get_losing_move(): Move {
    throw new Error("not implemented");
  }
}

class Rock extends Move {
  score: number = 1;
  public toString(): string {
    return "R";
  }
  public isWin(move: Move): boolean {
    return move instanceof Sissors;
  }

  public get_winning_move(): Move {
    return new Paper();
  }
  public get_losing_move(): Move {
    return new Sissors();
  }
}

class Paper extends Move {
  score: number = 2;
  public toString(): string {
    return "P";
  }
  public isWin(move: Move): boolean {
    return move instanceof Rock;
  }
  public get_winning_move(): Move {
    return new Sissors();
  }
  public get_losing_move(): Move {
    return new Rock();
  }
}
class Sissors extends Move {
  score: number = 3;
  public toString(): string {
    return "S";
  }
  public isWin(move: Move): boolean {
    return move instanceof Paper;
  }
  public get_winning_move(): Move {
    return new Rock();
  }
  public get_losing_move(): Move {
    return new Paper();
  }
}

function playRPS(a: Move, b: Move): number {
  if (b.isDraw(a)) {
    // tie
    return 3 + b.getScore();
  } else if (a.isWin(b)) {
    // a wins
    return 0 + b.getScore();
  } else if (b.isWin(a)) {
    // b wins
    return 6 + b.getScore();
  }
  console.log("error, should not get here");
  return 0;
}

function playPartOne() {
  let total_score = 0;
  for (let line of input.split("\n")) {
    // do something with each line

    // parse line
    let v = line.split(" ");
    let opp_play = v[0];
    let my_play = v[1];

    // decode to move
    let opp_move: Move = decode_opp_move(opp_play);
    let my_move: Move = decode_my_move(my_play);

    const score = playRPS(opp_move, my_move);
    total_score += score;
    /*
    console.debug(
      `opp_play: ${opp_play}, ${opp_move}, my_play: ${my_play}, ${my_move}: score: ${score} --> total: ${total_score}`
    );
    */
  }
  return total_score;
}

function playPartTwo() {
  let total_score = 0;
  for (let line of input.split("\n")) {
    // do something with each line

    // parse line
    let v = line.split(" ");
    let opp_play = v[0];
    let my_play = v[1];

    // decode to move
    let opp_move: Move = decode_opp_move(opp_play);
    let my_move: Move = decode_my_move_part_two(my_play, opp_move);

    const score = playRPS(opp_move, my_move);
    total_score += score;
  }
  return total_score;
}

// print out total score
console.log("----------- PART ONE -------------");
console.log("Grand Total: -> " + playPartOne());
console.log("------------------------");
console.log("Part one done");

console.log("---------- Debugging example input -------------");
console.log(playRPS(new Rock(), new Paper()));
console.log(playRPS(new Paper(), new Rock()));
console.log(playRPS(new Sissors(), new Sissors()));
console.log("------------------------");

console.log("----------- PART TWO -------------");
console.log("Grand Total: -> " + playPartTwo());
console.log("------------------------");
console.log("Part two done");

function decode_my_move(my_play: string) {
  let my_move: Move = new Rock();
  switch (my_play) {
    case "X":
      my_move = new Rock();
      break;
    case "Y":
      my_move = new Paper();
      break;
    case "Z":
      my_move = new Sissors();
      break;
    default:
      console.warn("my_play error, should not get here", my_play);
      break;
  }
  return my_move;
}

function decode_my_move_part_two(my_play: string, opp_move: Move) {
  let my_move: Move = new Rock();
  switch (my_play) {
    case "X":
      // need to lose
      my_move = opp_move.get_losing_move();
      break;
    case "Y":
      // need tp draw, i.e. same move as opp
      my_move = opp_move;
      break;
    case "Z":
      // need to win
      my_move = opp_move.get_winning_move();
      break;
    default:
      console.warn("my_play error, should not get here", my_play);
      break;
  }
  return my_move;
}

function decode_opp_move(opp_play: string) {
  let opp_move: Move = new Rock();
  switch (opp_play) {
    case "A":
      opp_move = new Rock();
      break;
    case "B":
      opp_move = new Paper();
      break;
    case "C":
      opp_move = new Sissors();
      break;
    default:
      console.warn("opp_play error, should not get here", opp_play);
      break;
  }
  return opp_move;
}
