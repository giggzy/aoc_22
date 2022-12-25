#!/usr/bin/env -S ts-node
import fs from "fs";
import path from "path";

// read the input files
const inputfile = path.join(__dirname, "input.txt");
let input = fs.readFileSync(inputfile, "utf8");

// Parsing is multi-step

// Parse initial state of stacks

// Parse the moves

// Parse the moves

// Apply the moves to the initial state

const test_input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

function parse_input(input: string) {
  const initial_state = new Map<string, Array<string>>();
  const moves = new Array<Move>();
  let parts = input.split("\n\n");

  let initial_lines = parts[0].split("\n");

  // A convienence map to convert char index to stack index, e.g. "1" -> 4
  let charIndexToStackLabel = new Map<number, string>();

  // process the lines in reverse order (bottom to top)
  for (let index = initial_lines.length; index > 0; index--) {
    let current_line = initial_lines[index - 1];
    console.log("Line: ", current_line);

    // first line
    // Create an array for each stack
    if (index === initial_lines.length) {
      for (let i = 0; i < current_line.length; i++) {
        const character = current_line.charAt(i);
        if (character === " ") {
          continue;
        }
        let stack = new Array<string>();
        // add the stack to the stacks
        initial_state.set(character, stack);
        charIndexToStackLabel.set(i, character);
      }
      console.log("Stacks: ", initial_state);
    } else {
      // populate the stacks
      for (let i = 0; i < current_line.length; i++) {
        let stackLabel = charIndexToStackLabel.get(i);
        if (
          stackLabel === undefined ||
          initial_state.get(stackLabel) === undefined ||
          current_line.charAt(i) === " "
        ) {
          // No stack here
          continue;
        } else {
          // Add the char to the stack
          initial_state.get(stackLabel)?.push(current_line.charAt(i));
        }
      }
    }
  }

  // Parse the moves
  let moves_lines = parts[1];
  const parse_move: RegExp = /move (\d+) from (\d+) to (\d+)/;
  for (let move_line of moves_lines.split("\n")) {
    // move 1 from 2 to 1
    // count, from, to
    let results = parse_move.exec(move_line);
    if (results === null) {
      console.log("skipping line: ", move_line);
    } else {
      moves.push(new Move(results[2], results[3], parseInt(results[1])));
    }
  }
  return { initial_state, moves };
}

class Move {
  from: string;
  to: string;
  count: number;

  constructor(from: string, to: string, count: number) {
    this.from = from;
    this.to = to;
    this.count = count;
  }
}

function solve_part1() {
  //parse_input(test_input);
  const { initial_state, moves } = parse_input(input);

  // log out the intial state and moves
  console.log("Initial state: ", initial_state);
  console.log("Moves: ", moves);
  print_out_state(initial_state);

  // Apply the moves to the initial state
  // Part 1
  console.log("Part One");
  apply_moves(initial_state, moves);
  console.log("Final state: ", initial_state);
  const top_crates = get_top_crates(initial_state);
  console.log("Top crates: ", top_crates);
}

function solve_part2() {
  console.log("Part Two");
  const { initial_state, moves } = parse_input(test_input);
  apply_moves2(initial_state, moves);
  console.log("Part Two: Top crates: ", get_top_crates(initial_state));
}

function apply_moves2(
  current_state: Map<string, Array<string>>,
  moves: Array<Move>
) {
  for (let move of moves) {
    let from_stack = current_state.get(move.from);
    let to_stack = current_state.get(move.to);
    if (from_stack === undefined || to_stack === undefined) {
      throw new Error("Invalid move");
    }
    // pop the count number of items from the from stack
    let popped = from_stack.splice(from_stack.length - move.count, move.count);
    // push the popped items onto the to stack
    for (let item of popped) {
      to_stack.push(item);
    }
    //print_out_state(current_state);
  }
}
function apply_moves(
  current_state: Map<string, Array<string>>,
  moves: Array<Move>
) {
  for (let move of moves) {
    let from_stack = current_state.get(move.from);
    let to_stack = current_state.get(move.to);
    if (from_stack === undefined || to_stack === undefined) {
      throw new Error("Invalid move");
    }
    // pop the count number of items from the from stack
    let popped = from_stack.splice(from_stack.length - move.count, move.count);
    // push the popped items onto the to stack
    for (let item of popped.reverse()) {
      to_stack.push(item);
    }
    //print_out_state(current_state);
  }
}

/* ----------------------------------------
// Utility functions
------------------------------------------- */

function get_top_crates(state: Map<string, Array<string>>) {
  const keys = Array.from(state.keys());
  keys.sort();
  const top_items = new Array<string>();

  for (let key of keys) {
    const stack = state.get(key);
    if (stack === undefined) {
      top_items.push(" ");
    } else top_items.push(`${stack[stack.length - 1]}`);
  }
  //console.log("Top Items: ", top_items.join(""));
  return top_items.join("");
}

function print_out_state(state: Map<string, Array<string>>) {
  const keys = Array.from(state.keys());
  keys.sort();
  const longest = get_longest_array_length(state);
  const lines = new Array<string>();
  for (let key of keys) {
    if (lines[0] === undefined) {
      lines[0] = "";
    }
    lines[0] += `  ${key}  `;
    let stack = state.get(key);
    if (stack === undefined) {
      throw new Error("Invalid state");
    }
    for (let i = 0; i < longest; i++) {
      if (lines[i + 1] === undefined) {
        lines[i + 1] = "";
      }
      if (stack[i] === undefined) {
        lines[i + 1] += "     ";
      } else {
        lines[i + 1] += ` [${stack[i]}] `;
      }
    }
  }
  console.log("current state: ");
  for (let line of lines) {
    console.log(line);
  }
}

function get_longest_array_length(state: Map<string, Array<string>>) {
  let longest = 0;
  for (let stack of state.values()) {
    if (stack.length > longest) {
      longest = stack.length;
    }
  }
  return longest;
}

solve_part1();
solve_part2();
