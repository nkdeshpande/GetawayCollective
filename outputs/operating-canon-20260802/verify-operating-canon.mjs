import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const path = 'C:/gc-app/outputs/operating-canon-20260802/GC-IA-V5-OPERATING-CANON-HOLISTIC-BUILD.xlsx';
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const summary = await workbook.inspect({ kind:'workbook,sheet', maxChars:8000 });
console.log(summary.ndjson);
const checks = await workbook.inspect({ kind:'table', range:"'Holistic Build Dashboard'!A1:I10", include:'values,formulas', maxChars:5000, tableMaxRows:12, tableMaxCols:10 });
console.log(checks.ndjson);
const errors = await workbook.inspect({ kind:'match', searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options:{useRegex:true,maxResults:300}, summary:'final formula error scan' });
console.log(errors.ndjson);
for (const sheetName of ['README','IA','Route Grammar','RBAC','AI Layer','Lifecycle','UX Invariants','Migration','Numbering Law','Object Model','Vehicle Workflows','Workflow Steps','Command Rights','SoD Controls','Aperture Projections','Evidence Model','AI Contracts','State Transitions','Audit & Fixes','Taxonomies','LG-01 Gate Register','LG-01 Task Register','Technology Capability Map','IA Delivery Map','Visual Detail Study','Holistic Build Dashboard']) {
  const image = await workbook.render({sheetName,autoCrop:'all',scale:1,format:'png'});
  await fs.writeFile(`./verify-${sheetName.replaceAll(' ','-').replaceAll('/','-')}.png`,new Uint8Array(await image.arrayBuffer()));
}
