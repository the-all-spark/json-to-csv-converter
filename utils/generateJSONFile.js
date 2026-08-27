// * Generating a huge json-file for testing

import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

import { correctJSONFileForGenerating } from "../streams/correctJSONFileForGenerating.js";

console.log("Generating JSON file...");

let fromFilePath = path.join(import.meta.dirname, '../assets/test.json');

let testFolderPath = path.join(import.meta.dirname, '../test');
let correctedFilePath = path.join(import.meta.dirname, '../test/correct-custom-test.json');
let fileForTestingPath = path.join(import.meta.dirname, '../test/test-to-run.json');

async function generateJSONFile() {
    try {
        await fsPromise.mkdir(testFolderPath);
        console.log("[MKDIR] 'test' directory has been created successfully!");

        await pipeline(
            fs.createReadStream(fromFilePath), 
            correctJSONFileForGenerating,
            fs.createWriteStream(correctedFilePath)
        );
        console.log("[CORRECT] Correcting of JSON file has been completed successfully!");

        let n = 0;
        while (n < 10) { // ! 3000
            await pipeline(
                fs.createReadStream(correctedFilePath),
                fs.createWriteStream(fileForTestingPath, {flags: 'a'})
            );
            n++;
        }
        console.log(`[GENERATE] Data has been appended [${n}] times.`);
        console.log("[OUTPUT] File for testing: /test/test-to-run.json")
    } catch (err) {
        console.error("[-ERROR-] Error of generating:", err.message);
    }
}

generateJSONFile(); 