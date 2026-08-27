#! /usr/bin/env node

// * CLI; file reading, converting and writing logic; uploading to GoogleDrive

import { Command } from "commander"; 
import figlet from "figlet";

import fs from "fs";
import { pipeline } from "stream/promises";

import { transformBufferToObject } from "./streams/transformBufferToObject.js";
import { createTransformJSONStream } from "./streams/createTransformJSONStream.js";
import { createUserFolder } from "./utils/createUserFolder.js"
import { uploadToGoogleDrive } from "./utils/uploadToGoogleDrive.js";

// ----------------------------------- CLI -----------------------------------

const program = new Command();

console.log(figlet.textSync("JSON   to   CSV"));

program
    .name("json-to-csv") 
    .version("1.0.0") 
    .description("Convert JSON to CSV") 
    .option("-s, --sourceFile <file>", "provide input file") 
    .option("-r, --resultFile <file>", "provide output file")
    .option("--sep, --separator <char>", "provide separator for CSV file", ",");

program.parse(process.argv);

const options = program.opts(); 

// ------------------------------ Converting logic -------------------------------

// Reading from file (Buffer) and writing into file

let sourceFilePath = options.sourceFile;
let resultFilePath = options.resultFile; 
let separator = options.separator;

let readFromJson;
let writeCSVToFile;

if (!sourceFilePath || !resultFilePath) {
  program.outputHelp();
} else {
  readFromJson = fs.createReadStream(sourceFilePath); 

  if (resultFilePath.includes("/")) {
    let pathSegments = resultFilePath.split("/");
    let folderName = pathSegments[0];
    
    if (!fs.existsSync(folderName)) {
      createUserFolder(folderName);
    } 
  }
  writeCSVToFile = fs.createWriteStream(resultFilePath);
}

// Converting

if (options.sourceFile && options.resultFile) {
  convert(options);
} else {
  console.log("-------------------------------------------------------------------------");
  console.error("[-ERROR-] Please, provide required options - input and output file paths!");
  console.log("-------------------------------------------------------------------------");
}

async function convert(options) {
    try {
        console.log("[ACTION] You provide the following options:");

        console.log("[OPTIONS]");
        console.log("Input file:", options.sourceFile);
        console.log("Output file:", options.resultFile);
        console.log("Separator for CSV file:", options.separator);
        console.log("------------------------------------------------------");

        await pipeline(
            readFromJson, 
            transformBufferToObject, 
            createTransformJSONStream(separator), 
            writeCSVToFile
        );
        console.log("[CONVERT] Converting has been completed successfully!");

        // Upload to Drive
        if (fs.existsSync(resultFilePath)) {
          uploadToGoogleDrive(resultFilePath);
        } else {
          console.error("[-ERROR-] File for uploading not found!");
        }
        
    } catch(err) {
        console.error("[-ERROR-] Converting error:", err.message);
    }
}