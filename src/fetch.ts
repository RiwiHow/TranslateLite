import OpenAI from "openai";
import { getPreferenceValues } from "@raycast/api";

interface PreferenceProps {
  openaiApiKey: string;
}

interface getAnswerProps {
  selectedText: string;
}

const { openaiApiKey } = getPreferenceValues<PreferenceProps>();
const client = new OpenAI({ apiKey: openaiApiKey });

export default async function getAnswer({ selectedText }: getAnswerProps) {
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: `请把下面的中文翻译成英文：${selectedText}。只需要翻译结果。`,
  });

  return response.output_text;
}
