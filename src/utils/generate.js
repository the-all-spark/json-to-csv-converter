// * Generating a json-file for testing

import fs from "fs";
import path from "path";
// import { Transform, pipeline } from "stream";

async function removeGeneratedFile() {
  try {
    let testFilePath = path.resolve(process.cwd(), 'new-test.json');

    if (fs.existsSync(testFilePath)) {
        fs.rm(testFilePath, { recursive: true, force: true }, (err) => console.log(err)); //!
        console.log("[REMOVE] Previous file for testing has been removed successfully!");
    }
    // ! убрать catch  - синхронный fs
  } catch (err) {
      console.error("[-ERROR-] Error of file removing: ", err.message);
  }
}

// let fromFilePath = path.resolve(process.cwd(), 'test.json');
let fromFilePath = path.resolve(process.cwd(), 'copy.json');

let fileForTestingPath = path.resolve(process.cwd(), 'new-test.json'); 

// ! переписать со стримами
const generateHighJSON = (path, times = 10) => {
  if (times > 10) {
    throw new Error("Error");
  }

  const data = JSON.parse(fs.readFileSync(path))
  console.log(data); //!

  const duplicatedData = Array(times).fill(data).flat()
  console.log(duplicatedData);

  fs.writeFileSync(
    fileForTestingPath,
    JSON.stringify(duplicatedData)
  )
} 

async function generateJSONFile() {
  try {
    // Remove previous test file
    await removeGeneratedFile();

    console.log("Generating JSON file...");

    const n = 10
    generateHighJSON(fromFilePath, n); // ! функция генерации 

    // ! убрать цикл, оставить pipeline
    // let n = 0;
    // while (n < 10) {
    //     await pipeline(
    //         fs.createReadStream(fromFilePath),
    //         fs.createWriteStream(fileForTestingPath, {flags: 'a'})
    //     );
    //     n++;
    // }

    console.log(`[GENERATE] Data has been appended [${n}] times.`);
    console.log("[OUTPUT] File for testing: new-test.json");
  } catch (err) {
    console.error("[-ERROR-] Error of generating:", err.message);
  }
}

generateJSONFile(); 