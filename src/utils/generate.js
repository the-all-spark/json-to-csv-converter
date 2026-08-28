// * Generating a json-file for testing

import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
// import { Transform } from "stream";

// !  удалить если конвертация работает и чтобы не создавать лишних файлов
// const correctJSONFileForGenerating = new Transform({
//   construct(callback) {
//       this.isFirstChunk = true;
//       callback();
//   },

//   transform(chunk, encoding, callback) {
//       let correctChunk = "";

//       if (this.isFirstChunk) {
//           correctChunk = chunk.toString().slice(1).replace("]", ","); 
//           this.isFirstChunk = false;
//       } else {
//           correctChunk = chunk.toString().replace("]", ",");
//       }

//       callback(null, correctChunk);
//   },
// });

async function removeGeneratedFile() {
    try {
        await fsPromise.rm(
        path.join(import.meta.dirname, "../test"), // ! изменить на файл new-text.json в корне
        { recursive: true, force: true }
        );
        console.log("[RMDIR] Previous directory for testing has been removed successfully!");
    } catch (err) {
        console.error("[-ERROR-] Error of removing: ", err.message);
    }
}

console.log("Generating JSON file...");

let fromFilePath = path.join(import.meta.dirname, '../../test.json');  // ! проверить путь (теперь в корне)
let fileForTestingPath = path.join(import.meta.dirname, '../../new-test.json'); // ! название заменить на new-test.json

async function generateJSONFile() {
    try {
        // !удалить чтобы не создавать лишних папок
        // ! файл должен сгенерироваться в ту же папку откуда взят
        // await fsPromise.mkdir(testFolderPath);
        // console.log("[MKDIR] 'test' directory has been created successfully!");

        //! удалить если конвертация работает и чтобы не создавать лишних файлов
        // await pipeline(
        //     fs.createReadStream(fromFilePath), 
        //     correctJSONFileForGenerating,  
        //     fs.createWriteStream(correctedFilePath)
        // );
        // console.log("[CORRECT] Correcting of JSON file has been completed successfully!");

        // ? удалить предыдущий тестовый файл
        // чтобы данные не накапливались в нем, а записывались заново
        removeGeneratedFile();

        // ! оставляем только логику генерации
        // console.log("Generating test file...");
        let n = 0;
        while (n < 10) {
            await pipeline(
                // fs.createReadStream(correctedFilePath), // ! из исходного test.json
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