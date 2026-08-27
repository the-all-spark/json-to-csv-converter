// * Converting header / row into line using passed separator value (or default value)

import { Transform } from "stream";
import { convertToLine } from "../utils/convertToLine.js"; 

export const createTransformJSONStream = (separator) => {
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