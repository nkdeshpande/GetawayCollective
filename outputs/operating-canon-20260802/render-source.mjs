import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Users/nkdes/Downloads/GC-IA-V5-OPERATING-CANON.xlsx'));
for (const [sheetName, range] of [['README','A1:B16'], ['IA','A1:AH28']]) {
  const image = await workbook.render({ sheetName, range, scale: 1.5, format: 'png' });
  await fs.writeFile(`./source-${sheetName.replaceAll(' ','-')}.png`, new Uint8Array(await image.arrayBuffer()));
}
