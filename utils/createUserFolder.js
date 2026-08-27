// * Creating folder for result file (if user provides folder name)

import fsPromise from "fs/promises";

export async function createUserFolder(folderName) {
  try {
    await fsPromise.mkdir(folderName);
    console.log(`[MKDIR] Creating user folder, named '${folderName}'...`);
  } catch (err) {
    console.error("[-ERROR-] User folder creation failed!");
  }
}
