import { getSelectedText } from "@raycast/api";
import { useEffect, useState } from "react";
import processError from "../Functions/processError";

export function useSelectedText() {
  const [selectedText, setSelectedText] = useState("");
  const [selectedTextError, setSelectedTextError] = useState("");

  useEffect(() => {
    async function getSelectedTextFunc() {
      try {
        const text = await getSelectedText();
        setSelectedText(text ?? "");
      } catch (error) {
        processError(error, setSelectedTextError);
      }
    }

    getSelectedTextFunc();
  }, []);

  return { selectedText, selectedTextError };
}
