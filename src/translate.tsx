import { Action, ActionPanel, Detail } from "@raycast/api";
import pangu from "pangu";
import { useEffect, useMemo, useState } from "react";
import useClipboard from "./Hooks/useClipboard";
import { useSelectedText } from "./Hooks/useSelectedText";
import getAnswer from "./Providers/QWEN/fetch";

export default function Command() {
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { selectedText, selectedTextError } = useSelectedText();
  const { clipboardText, clipboardTextError } = useClipboard();

  const textToTranslate = useMemo(() => {
    return selectedText || clipboardText;
  }, [selectedText, clipboardText]);

  const { target_lang } = useMemo(() => {
    const hasChinese = /[\u4e00-\u9fa5]/.test(textToTranslate);
    return {
      target_lang: hasChinese ? "English" : "Chinese",
    };
  }, [textToTranslate]);

  useEffect(() => {
    if (textToTranslate) {
      setError("");
      return;
    }

    if (selectedTextError) {
      setError(selectedTextError);
    } else if (clipboardTextError) {
      setError(clipboardTextError);
    } else {
      setError("No text found to translate");
    }
  }, [textToTranslate, selectedTextError, clipboardTextError]);

  useEffect(() => {
    if (!textToTranslate) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setTranslatedText("");

    let isCancelled = false;

    async function fetchStreamingTranslation() {
      try {
        const stream = getAnswer({
          selectedText: textToTranslate,
          target_lang,
        });
        for await (const chunk of stream) {
          if (isCancelled) {
            break;
          }
          setTranslatedText(chunk);
        }
      } catch (e) {
        if (!isCancelled) {
          setError((e as Error).message || "Translation failed");
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
  }, [textToTranslate, target_lang]);

  const getMarkdown = useMemo(() => {
    if (error) {
      return error;
    }

    if (isLoading) return translatedText || `Translating: ${textToTranslate}`;

    if (target_lang === "English") {
      return translatedText;
    } else {
      return `${textToTranslate}\n\n${pangu.spacingText(translatedText)}`;
    }
  }, [error, isLoading, translatedText, textToTranslate, target_lang]);

  return (
    <Detail
      markdown={getMarkdown}
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
