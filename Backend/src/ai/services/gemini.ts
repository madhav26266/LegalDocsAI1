import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeText(text: string): Promise<string> {
  const prompt: string = `
  Extract the key information from the following document and give a clear summary.
  Document text:
  ${text}
  `;

  const result: { response: { text: () => string } } = await model.generateContent(prompt);
  return result.response.text();
}