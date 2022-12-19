//  read in the input file
import fs from "fs";

let elves_cals: number[] = [];
let current_total = 0;
const input = fs.readFileSync("input.txt", "utf8");
for (let line of input.split("\n")) {
  // do something with each line
  console.info(line);
  // parse the data
  if (line == "") {
    elves_cals.push(current_total);
    current_total = 0;
  } else {
    current_total += parseInt(line);
  }
}
console.debug(elves_cals);
// print out the elf with most cals
elves_cals.sort((a, b) => b - a);
console.debug("sorted", elves_cals);
console.info("Most cal carried by one elf", elves_cals[0]);
// sum the top three calaories
let top_three = elves_cals.slice(0, 3);
console.info(
  "Sum of top three elves",
  top_three.reduce<number>((a, b) => a + b, 0)
);
//console.info("Most cal carried by three elf", elves_cals[0])
