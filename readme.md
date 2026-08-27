# Json-to-Csv converter

## Description

A command line tool that can be used to **convert JSON file to CSV**.  
A developer has also an opportunity to upload the result CSV file to their Google Drive.

## Tool installation
`npm install the-all-spark/json-to-csv-converter`  
`npm install -g .`

## Testing

- create file for testing (test/test-to-run.json):  
`npm run generate` 

- remove test folder (if necessary)  
`npm run clean`

Note:  
**To upload the result file** to Google Drive, developer needs to:
- create their project in Google Cloud Console;
- get their personal keys and refresh_token;
- create a local `.env` file and fill it with the data (according to the `.env.example` file).

## CLI tool usage

Display help information:   
`converter`

### Options

**Required**:  
`--sourceFile` (or `-s`) - path to the json file that need to be converted  
`--resultFile` (or `-r`) - path to the result csv file  

**Optional**:  
`--separator` (or `--sep`) - separator that is used while converting ("," by default)  

### Examples

With test file:  
- `converter --sourceFile test/test-to-run.json --resultFile output.csv`  
- `converter -s test/test-to-run.json -r output.csv`  
- `converter -s test/test-to-run.json -r result/output.csv`
- `converter -s test/test-to-run.json -r output.csv --sep \.`

With custom file:  
- `converter --sourceFile input.json --resultFile output.csv`  
- `converter -s input.json -r output.csv` 
- `converter -s input.json -r result/output.csv`  
- `converter -s input.json -r output.csv --sep \;`  