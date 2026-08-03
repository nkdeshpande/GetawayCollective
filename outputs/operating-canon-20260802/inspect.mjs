import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const source = 'C:/Users/nkdes/Downloads/GC-IA-V5-OPERATING-CANON.xlsx';
const input = await FileBlob.load(source);
const workbook = await SpreadsheetFile.importXlsx(input);
const result = await workbook.inspect({
  kind: 'workbook,sheet,table',
  maxChars: 14000,
  tableMaxRows: 10,
  tableMaxCols: 12,
  tableMaxCellChars: 100,
});
console.log(result.ndjson);
