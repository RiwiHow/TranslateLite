import { getSelectedText } from "@raycast/api";
import { useEffect, useState } from "react";
import processError from "../Functions/processError";

export function useSelectedText() {
  const [selectedText, setSelectedText] = useState("");
  const [selectedTextError, setSelectedTextError] = useState("");
  // const textRef = useRef(selectedText); // To fix the issue where selectedText cannot be accurately retrieved in developer mode when "Use Node production environment" is disabled.
  // textRef.current = selectedText;

  useEffect(() => {
    async function getSelectedTextFunc() {
      try {
        const text = await getSelectedText();
        // if (!textRef.current) {
        setSelectedText(text ?? "");
        // }
      } catch (error) {
        processError(error, setSelectedTextError);
      }
    }

    getSelectedTextFunc();
  }, []);

  return { selectedText, selectedTextError };
}
