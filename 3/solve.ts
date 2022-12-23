#!/usr/bin/env -S ts-node
import fs from "fs";
import path from "path";

// read the input files
const inputfile = path.join(__dirname, "input.txt");
let input = fs.readFileSync(inputfile, "utf8");

// parse input into bags with two compartments of items
function examine_bags(input: string) {
  let total = 0;
  for (let bag of input.split("\n")) {
    let compartments = examine_bag(bag);
    //console.debug(compartments);
    const duplicate_items = find_duplicate_items(compartments);
    //console.debug(duplicate_items);
    total += get_letter_value(duplicate_items[0]);
  }
  console.info("Total Part One: ", total);
}

const compartment_count = 2;
// divide to list into compartments
function examine_bag(bag: string) {
  let items = bag.split(""); // split the bag into items
  let items_per_compartment = Math.ceil(items.length / compartment_count); // find the number of items per compartment
  const compartments = new Array<string>(compartment_count)
    .fill("")
    .map((_, i) => items.splice(0, items_per_compartment));

  return compartments;
}

// find the first duplicate item in both compartments
function find_duplicate_items(compartments: string[][]) {
  let duplicate_items = new Array<string>();
  for (let item of compartments[0]) {
    if (compartments[1].includes(item)) {
      duplicate_items.push(item);
    }
  }
  return duplicate_items;
}

function find_duplicate_items2(groups: string[][]) {
  let duplicate_items = new Array<string>();
  // loop each group
  for (let group of groups) {
    // loop each item in the group
    for (let item of group) {
      // check if the item is in all other groups
      if (groups.filter((g) => g.includes(item)).length === groups.length) {
        duplicate_items.push(item);
      }
    }
  }
  return duplicate_items;
}

function get_letter_value(letter: string) {
  // get a number from a letter
  // a-z = 1-26
  // A-Z = 27-52
  if (letter === letter.toUpperCase()) {
    return letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
  }
  return letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
}

console.log("============================");
console.log("DEGUUGING");
console.log("============================");
console.log(`a: ${get_letter_value("a")}`);
console.log(`z: ${get_letter_value("z")}`);
console.log(`A: ${get_letter_value("A")}`);
console.log(`Z: ${get_letter_value("Z")}`);

// PART 1

const example_input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

examine_bags(input);

/*
// PART 2

// parse input into groups of bags, 3 bags per group
// find the common item in each group, assume there is only one
// get the letter value of the common items for all groups, reuse the get_letter_value function
// print out the sum of all letter values
*/

//examine_groups(example_input);
examine_groups(input);

/*
2833 is too high
*/
function examine_groups(input: string) {
  let total = 0;
  const groups = input.split("\n");
  for (let i = 0; i < groups.length; i += 3) {
    // 3 bags per group
    let bags = groups.slice(i, i + 3);
    // convert each bag into list of items
    let item_bags = bags.map((bag) => bag.split(""));
    //console.debug(bags);
    let common_items = find_duplicate_items2(item_bags);
    //console.debug(common_items);
    total += get_letter_value(common_items[0]);
  }

  console.info("Total Part Two: ", total);
}
