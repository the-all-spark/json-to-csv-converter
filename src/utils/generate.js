// * Generating a json-file for testing

import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

async function removeGeneratedFile() {
  try {
    let testFilePath = path.resolve(process.cwd(), 'new-test.json');

    if (fs.existsSync(testFilePath)) {
        await fsPromise.rm(testFilePath, { recursive: true, force: true });
        console.log("[REMOVE] Previous file for testing has been removed successfully!");
    }
  } catch (err) {
      console.error("[-ERROR-] Error of file removing: ", err.message);
  }
}

let fromFilePath = path.resolve(process.cwd(), 'test.json');
let fileForTestingPath = path.resolve(process.cwd(), 'new-test.json'); 

async function generateJSONFile() {
  try {
    // Remove previous test file
    await removeGeneratedFile();

    console.log("Generating JSON file...");
    let n = 0;
    while (n < 10) {
        await pipeline(
            fs.createReadStream(fromFilePath),
            fs.createWriteStream(fileForTestingPath, {flags: 'a'})
        );
        n++;
    }
    console.log(`[GENERATE] Data has been appended [${n}] times.`);
    console.log("[OUTPUT] File for testing: new-test.json");
  } catch (err) {
    console.error("[-ERROR-] Error of generating:", err.message);
  }
}

generateJSONFile(); 