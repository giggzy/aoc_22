#!/usr/bin/env -S ts-node
import fs from "fs";
import path from "path";

// read the input files
const inputfile = path.join(__dirname, "input.txt");
let input = fs.readFileSync(inputfile, "utf8");

const test_input = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

// read the data input
// keep track of packet start index
// loop the input
//  -- keep track of index to start
//  -- keep track of the last four characters
//  -- check if the last four characters are all different
//     -- if they are: add the index of current character to the list
// return the list of packet start indexes

function find_start_indexes(input: string, marker_length: number) {
  const packet_start_indexes = new Array<number>();
  let previous_characters = new Array<string>();
  for (let index = 0; index < input.length; index++) {
    const character = input[index];
    previous_characters.push(character);
    if (previous_characters.length > marker_length) {
      previous_characters.shift();
    }
    if (previous_characters.length === marker_length) {
      // are the characters all different?
      const unique_characters = new Set(previous_characters);
      if (unique_characters.size === marker_length) {
        packet_start_indexes.push(index + 1);
      }
    }
  }
  return packet_start_indexes;
}

// GLOBALS
const start_of_packet_marker_length = 4;
const start_of_message_marker_length = 14;
console.info(
  "TEST 1 First Packet start index: ",
  find_start_indexes(test_input, start_of_packet_marker_length)[0]
);
console.info(
  "TEST 1 First Message start index: ",
  find_start_indexes(test_input, start_of_message_marker_length)[0]
);
console.info(
  "PART ONE: Packet start index: ",
  find_start_indexes(input, start_of_packet_marker_length)[0]
);
console.info(
  "PART TWO: Message start index: ",
  find_start_indexes(input, start_of_message_marker_length)[0]
);
