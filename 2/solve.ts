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
}

class Rock extends Move {
  score: number = 1;
  public toString(): string {
    return "R";
  }
  public isWin(move: Move): boolean {
    return move instanceof Sissors;
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
}
class Sissors extends Move {
  score: number = 3;
  public toString(): string {
    return "S";
  }
  public isWin(move: Move): boolean {
    return move instanceof Paper;
  }
}

function playRPS(a: Move, b: Move): number {
  if (a.isDraw(b)) {
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

let total_score = 0;
for (let line of input.split("\n")) {
  // do something with each line
  //console.info(line);
  // parse the line
  //let { opp_play, my_play } = line.split(" ", 2);
  //console.debug(`opp_play: ${opp_play}, my_play: ${my_play}`);
  let v = line.split(" ");
  let opp_play = v[0];
  let my_play = v[1];
  //console.debug(`opp_play: ${v[0]}, my_play: ${v[1]}`);

  // convert to move
  let opp_move: Move = new Rock();
  let my_move: Move = new Rock();
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
      console.log("opp_play error, should not get here", opp_play);
      break;
  }

  switch (my_play) {
    case "X":
      my_move = new Rock();
      break;
    case "Y":
      opp_move = new Paper();
      break;
    case "Z":
      opp_move = new Sissors();
      break;
    default:
      console.log("my_play error, should not get here", my_play);
      break;
  }
  const score = playRPS(opp_move, my_move);
  total_score += score;
  console.debug(
    `opp_play: ${opp_play}, ${opp_move}, my_play: ${my_play}, ${my_move}: score: ${score} --> total: ${total_score}`
  );
}
console.log("------------------------");
console.log(playRPS(new Rock(), new Paper()));
console.log(playRPS(new Paper(), new Rock()));
console.log(playRPS(new Sissors(), new Sissors()));

// print out total score
console.log("------------------------");
console.log(total_score);
console.log("------------------------");
console.log("done");
