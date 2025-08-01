import { Action, ActionPanel, Detail } from "@raycast/api";
import { useEffect, useState } from "react";
import { useSelectedText } from "./Hooks/useSelectedText";
import getAnswer from "./Providers/QWEN/fetch";

export default function Command() {
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { selectedText, error, setError } = useSelectedText();

  useEffect(() => {
    if (!selectedText) {
      return;
    }

    setIsLoading(true);
    setTranslatedText("");
    setError(undefined);

    let isCancelled = false;

    async function fetchStreamingTranslation() {
      try {
        const stream = getAnswer({ selectedText });
        for await (const chunk of stream) {
          if (isCancelled) {
            break;
          }
          setTranslatedText(chunk);
        }
      } catch (e) {
        if (!isCancelled) {
          setError(e as Error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchStreamingTranslation();

    return () => {
      isCancelled = true;
    };
  }, [selectedText]);

  function getMarkdown() {
    if (error) {
      return error.message;
    }
    if (translatedText) {
      return translatedText;
    }
    if (isLoading) {
      return translatedText || `Translating: \`${selectedText}\``;
    }
  }

  return (
    <Detail
      markdown={getMarkdown()}
      isLoading={isLoading}
      actions={
        translatedText && !error && !isLoading ? (
          <ActionPanel>
            <Action.Paste
              title="Paste to Active App"
              content={translatedText}
            />
            <Action.CopyToClipboard
              title="Copy Translation"
              content={translatedText}
            />
          </ActionPanel>
        ) : undefined
      }
    />
  );
}
