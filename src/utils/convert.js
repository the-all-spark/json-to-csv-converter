import fs from "fs";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

import { uploadToGoogleDrive } from "./google.js";

// Converting one JSON-object to one CSV-line

function convertToLine (arr, separator) {
  return arr.join(separator) + "\n";
}

// Creating streams for reading from file and writing into file

let readFromJson;
let writeCSVToFile;

function checkOptions(options) {
  if (options.sourceFile && options.resultFile) {
    readFromJson = fs.createReadStream(options.sourceFile);
    writeCSVToFile = fs.createWriteStream(options.resultFile);
  } else {
    console.error("[-ERROR-] Error of checking options. Please provide input and output file paths!")
  }
}

// Transforming from Buffer into object

let objRemainder = "";

const transformBufferToObject = new Transform({
    writableObjectMode: false,
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
        let fullChunk = objRemainder + chunk.toString();

        let startObjIndex = -1;
        let endIndex = 0;

        for (let i = 0; i < fullChunk.length; i++) {
            let char = fullChunk[i];

            if (char === "{") {
                startObjIndex = i;
            } else if (char === "}" && startObjIndex !== -1) {
                let fullJSONString = fullChunk.slice(startObjIndex, i + 1);
                
                try {
                    let singleObj = JSON.parse(fullJSONString);
                    this.push(singleObj);
                } catch(err) {
                    console.error("[-ERROR-] Parsing error: ", err.message);
                }

                endIndex = i + 1;
                startObjIndex = -1;          
            }
        }
        objRemainder = fullChunk.slice(endIndex);

        callback();
    }
});

// Converting header / row into line using passed separator value (or default value)

const createTransformJSONStream = (separator) => {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: false,

    construct(callback) {
      this.isFirstObj = true;
      this.separator = separator;
      callback();
    },

    transform(obj, encoding, callback) {
      let outputLine = "";

      if (this.isFirstObj) {
        const headerLine = convertToLine(Object.keys(obj), this.separator); 
        outputLine += headerLine;
        this.isFirstObj = false;
      }

      let objValuesLine = convertToLine(Object.values(obj), this.separator);
      outputLine += objValuesLine;

      callback(null, outputLine);
    }
  });
};

// * Main converting logic

export async function convert(options) {
    try {
        checkOptions(options);

        console.log("[OPTIONS] You provide the following options:");
        console.log("Input file:", options.sourceFile);
        console.log("Output file:", options.resultFile);
        console.log("Separator for CSV file:", options.separator);
        
        console.log("Converting to CSV...");

        await pipeline(
            readFromJson, 
            transformBufferToObject, 
            createTransformJSONStream(options.separator), 
            writeCSVToFile
        );
        console.log("[CONVERT] Converting has been completed successfully!");

        // * Upload to Drive
        if (fs.existsSync(options.resultFile)) {
          uploadToGoogleDrive(options.resultFile);
        } else {
          console.error("[-ERROR-] File for uploading not found!");
        }
        
    } catch(err) {
        console.error("[-ERROR-] Converting error:", err.message);
    }
}