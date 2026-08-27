// * Removing test folder with files before subsequent test generation

import fsPromise from "fs/promises";
import path from "path";

async function removeGeneratedFiles() {
    try {
        await fsPromise.rm(
          path.join(import.meta.dirname, "../test"), 
          { recursive: true, force: true }
        );
        console.log("[RMDIR] Previous directory for testing has been removed successfully!");
    } catch (err) {
        console.error("[-ERROR-] Error of removing: ", err.message);
    }
}

removeGeneratedFiles();