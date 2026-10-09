# Json-to-Csv converter

## Description

A command line tool that can be used to **convert JSON file to CSV** and upload the result CSV file to Google Drive.  
Developers have also an opportunity to generate testing file.

## Tool installation
`npm i @the-all-spark/json-to-csv-converter`  
or globally:    
`npm i -g @the-all-spark/json-to-csv-converter`

## Testing (for developers)

Generate file for testing (command below will create new-test.json in root directory):  
`npm run generate`   
...or use test.json from the root directory.

## CLI usage

Display help information:   
`converter`

### Options

**Required**:  
`--sourceFile` (or `-s`) - path to the json file that need to be converted  
`--resultFile` (or `-r`) - path to the result csv file  

**Optional**:  
`--separator` (or `--sep`) - separator that is used while converting ("," by default)  

Note:  
**To upload the result file** to your Google Drive, you need to:
- create project in [Google Cloud Console](https://console.cloud.google.com/cloud-resource-manager);
- get your personal keys and refresh_token;
- create a local `.env` file and fill it with the data (according to the `.env.example` file).

### Examples

With test file:  
- `converter --sourceFile new-test.json --resultFile output.csv`  
- `converter -s new-test.json -r output.csv`  
- `converter -s new-test.json -r output.csv --sep \.`

With custom file:  
- `converter --sourceFile input.json --resultFile output.csv`  
- `converter -s input.json -r output.csv`  
- `converter -s input.json -r output.csv --sep \;`  