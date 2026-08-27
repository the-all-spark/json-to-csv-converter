// * Correcting JSON-file

import { Transform } from "stream";

export const correctJSONFileForGenerating = new Transform({
  construct(callback) {
      this.isFirstChunk = true;
      callback();
  },

  transform(chunk, encoding, callback) {
      let correctChunk = "";

      if (this.isFirstChunk) {
          correctChunk = chunk.toString().slice(1).replace("]", ","); 
          this.isFirstChunk = false;
      } else {
          correctChunk = chunk.toString().replace("]", ",");
      }

      callback(null, correctChunk);
  },
});