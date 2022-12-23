#!/usr/bin/env -S ts-node
import fs from "fs";
import path from "path";

// read the input files
const inputfile = path.join(__dirname, "input.txt");
let input = fs.readFileSync(inputfile, "utf8");

const example_input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

// parse the pairs of ranges in min-max format
// check if one range is within another
// sum the pairs where one range is within another

class Range {
  min!: number;
  max!: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }
  // to string
  public toString() {
    return `${this.min}-${this.max}`;
  }
}

function parse_ranges(input: string, check_function: Function) {
  let total = 0;
  for (let line of input.split("\n")) {
    //console.debug("Line: ", line);
    let ranges = new Array<Range>();
    for (let range of line.split(",")) {
      let min = range.split("-")[0];
      let max = range.split("-")[1];
      let r = new Range(parseInt(min), parseInt(max));
      ranges.push(r);
    }
    // do something with the ranges
    //console.log(ranges);
    if (check_function(ranges)) {
      total++;
    }
  }
  return total;
}

function check_for_contained_ranges(ranges: Range[]) {
  //console.debug("Checking for contained ranges: ", ranges, ranges.length);
  for (let index = 0; index < ranges.length; index++) {
    const range = ranges[index];
    for (let index2 = 0; index2 < ranges.length; index2++) {
      if (index === index2) {
        continue; // skip the same range
      }
      const range2 = ranges[index2];
      if (range.min >= range2.min && range.max <= range2.max) {
        // range is contained in range2
        //console.debug(`XX ${range} is contained in ${range2}`);
        return true;
      }
    }
  }
  return false;
}

function check_for_overlapping_ranges(ranges: Range[]) {
  for (let index = 0; index < ranges.length; index++) {
    const range = ranges[index];
    for (let index2 = 0; index2 < ranges.length; index2++) {
      if (index === index2) {
        continue; // skip the same range
      }
      const range2 = ranges[index2];
      if (range.min <= range2.max && range.max >= range2.min) {
        // ranges overlap
        //console.debug(`XX ${range} overlaps ${range2}`);
        return true;
      }
    }
  }
  return false;
}

console.log("============================");
//console.info("Total Part One (example): ", parse_ranges(example_input));
//console.info("Total Part One: ", parse_ranges(input));
console.info(
  "Total Part One: ",
  parse_ranges(input, check_for_contained_ranges)
);
console.info(
  "Total Part Two: ",
  parse_ranges(input, check_for_overlapping_ranges)
);
console.log("============================");
