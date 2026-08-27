// * Transforming from Buffer into object

import { Transform } from "stream";

let objRemainder = "";

export const transformBufferToObject = new Transform({
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