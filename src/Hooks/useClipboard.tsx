import { Clipboard } from "@raycast/api";
import { useEffect, useState } from "react";
import processError from "../Functions/processError";

export default function useClipboard() {
  const [clipboardText, setClipboardText] = useState("");
  const [clipboardTextError, setClipboardTextError] = useState("");

  useEffect(() => {
    async function getClipboard() {
      try {
        const text = await Clipboard.readText();
        setClipboardText(text ?? "");
      } catch (error) {
        processError(error, setClipboardTextError);
      }
    }

    getClipboard();
  }, []);

  return { clipboardText, clipboardTextError };
}
