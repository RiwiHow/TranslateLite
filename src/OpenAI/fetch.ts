import OpenAI from "openai";
import { getPreferenceValues } from "@raycast/api";
import { translationPrompt } from "./prompt";

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
    instructions: `${translationPrompt}`,
    input: `${selectedText}`,
  });

  return response.output_text;
}
