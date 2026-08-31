import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Transform } from "stream";

function removeGeneratedFile() {
  let testFilePath = path.resolve(process.cwd(), 'new-test.json');

  if (fs.existsSync(testFilePath)) {
    fs.rm(testFilePath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("[-ERROR-] Error of file removing: ", err.message);
      }
    });
  }
}

const correctJSONFileForGenerating = new Transform({
  construct(callback) {
      this.isFirstChunk = true;
      callback();
  },

  transform(chunk, encoding, callback) {
      let correctChunk = "";

      if (this.isFirstChunk) {
          correctChunk = chunk.toString().slice(1).replace("]", ""); 
          this.isFirstChunk = false;
      } else {
          correctChunk = chunk.toString().replace("]", "");
      }

      callback(null, correctChunk);
  },
});

let fromFilePath = path.resolve(process.cwd(), "test.json");
let fileForTestingPath = path.resolve(process.cwd(), "new-test.json");

async function generateJSONFile() {
  try {
    // Remove previous test file
    removeGeneratedFile();

    let correctedFilePath = path.resolve(process.cwd(), "correct.json");

    await pipeline(
        fs.createReadStream(fromFilePath), 
        correctJSONFileForGenerating,  
        fs.createWriteStream(correctedFilePath)
    );

    console.log("Generating JSON file...");

    const finalWriteStream = fs.createWriteStream(fileForTestingPath, { flags: "a" });
    finalWriteStream.setMaxListeners(0); 

    finalWriteStream.write('[');

    let n = 0;
    while (n < 10) {
      if (n > 0) {
        finalWriteStream.write(",");
      }
      await pipeline(
        fs.createReadStream(correctedFilePath),
        finalWriteStream,
        { end: false }
      );
      n++;
    }

    finalWriteStream.end(']');

    await new Promise((resolve) => finalWriteStream.on('finish', resolve));

    console.log(`[GENERATE] Data has been appended [${n}] times.`);
    console.log("[OUTPUT] File for testing: new-test.json");

    fs.unlinkSync(correctedFilePath);
  } catch (err) {
    console.error("[-ERROR-] Error of generating:", err.message);
  }
}

generateJSONFile(); 