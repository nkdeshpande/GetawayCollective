import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const path='C:/gc-app/outputs/operating-canon-20260802/GC-IA-V5-OPERATING-CANON-TECHNOLOGY-CONSOLIDATED.xlsx';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(path));
console.log((await wb.inspect({kind:'table',range:"'Actual Technology Stack'!A1:I23",include:'values,formulas',tableMaxRows:25,tableMaxCols:9,maxChars:12000})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:300},summary:'formula errors'})).ndjson);
for(const sheetName of ['Actual Technology Stack','Holistic Build Dashboard']){const image=await wb.render({sheetName,autoCrop:'all',scale:1,format:'png'});await fs.writeFile(`./technology-${sheetName.replaceAll(' ','-')}.png`,new Uint8Array(await image.arrayBuffer()));}
