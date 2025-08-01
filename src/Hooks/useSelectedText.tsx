import { useEffect, useState, useRef } from "react";
import { getSelectedText } from "@raycast/api";

export function useSelectedText() {
  const [selectedText, setSelectedText] = useState("");
  const [error, setError] = useState<Error>();
  const textRef = useRef(selectedText);
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

  return { selectedText, error };
}
