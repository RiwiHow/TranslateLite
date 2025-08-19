import { getPreferenceValues } from "@raycast/api";

interface PreferenceProps {
  qwenApiKey: string;
}

interface getAnswerProps {
  selectedText: string;
  target_lang: string;
}

const { qwenApiKey } = getPreferenceValues<PreferenceProps>();

export default async function* getAnswer({
  selectedText,
  target_lang,
}: getAnswerProps) {
  const response = await fetch(
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${qwenApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-mt-plus",
        messages: [
          {
            role: "user",
            content: selectedText,
          },
        ],
        stream: true,
        translation_options: {
          source_lang: "auto",
          target_lang: target_lang,
        },
      }),
    }
  );

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value } = await reader.read();

    buffer = decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.substring(6);
        const json = JSON.parse(data);
        if (json.choices[0]?.finish_reason === "stop") {
          return;
        }
        try {
          const content = json.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
  }
}
