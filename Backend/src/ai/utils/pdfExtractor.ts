import fs from "fs";
import pdf from "pdf-parse";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer: Buffer = fs.readFileSync(filePath);
  const pdfData: { text: string } = await pdf(dataBuffer);
  return pdfData.text;
}