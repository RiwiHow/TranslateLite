import { getSelectedText } from "@raycast/api";
import { useEffect, useRef, useState } from "react";

export function useSelectedText() {
  const [selectedText, setSelectedText] = useState("");
  const [error, setError] = useState<Error>();
  const textRef = useRef(selectedText); // To fix the issue where selectedText cannot be accurately retrieved in developer mode
  textRef.current = selectedText;

  useEffect(() => {
    getSelectedText()
      .then((text) => {
        if (!textRef.current) {
          setSelectedText(text ?? "");
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return { selectedText, error, setError };
}
