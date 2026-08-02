import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const path='C:/gc-app/outputs/operating-canon-20260802/GC-IA-V5-OPERATING-CANON-OBJECT-ALIGNED.xlsx';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(path));
console.log((await wb.inspect({kind:'workbook,sheet',maxChars:5000})).ndjson);
console.log((await wb.inspect({kind:'table',range:"'L2 Lifecycle Alignment'!A1:F26",include:'values,formulas',tableMaxRows:28,tableMaxCols:6,maxChars:10000})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:300},summary:'formula errors'})).ndjson);
for(const sheetName of ['L2 Object Catalogue','L2 Lifecycle Alignment','Holistic Build Dashboard']){const image=await wb.render({sheetName,autoCrop:'all',scale:1,format:'png'});await fs.writeFile(`./final-${sheetName.replaceAll(' ','-')}.png`,new Uint8Array(await image.arrayBuffer()));}
