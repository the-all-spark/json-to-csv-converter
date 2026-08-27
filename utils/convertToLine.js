// * Converting one JSON-object to one CSV-line

export function convertToLine (arr, separator) {
    return arr.join(separator) + "\n";
}
