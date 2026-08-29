#! /usr/bin/env node

import { Command } from "commander"; 
import { convert } from "../src/utils/convert.js";

const program = new Command();

program
    .name("json-to-csv") 
    .version("1.0.0") 
    .description("Convert JSON to CSV") 
    .option("-s, --sourceFile <file>", "provide input file") 
    .option("-r, --resultFile <file>", "provide output file")
    .option("--sep, --separator <char>", "provide separator for CSV file", ",");

program.parse(process.argv);

const options = program.opts(); 

// Converting
if (options.sourceFile && options.resultFile) {
  convert(options);
} else {
  console.error("[-ERROR-] Please, provide required options - input and output file paths!");
  program.outputHelp();
}