import { Detail, getSelectedText, Action, ActionPanel } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useEffect, useState } from "react";
import getAnswer from "./fetch";

export default function Command() {
  const [selectedText, setSelectedText] = useState<string>("");

  useEffect(() => {
    getSelectedText().then(setSelectedText);
  }, []);

  const { data, error, isLoading } = usePromise(getAnswer, [{ selectedText }], {
    execute: !!selectedText,
  });

  const errorMes = "Something went wrong!";

  return (
    <Detail
      markdown={error ? errorMes : data}
      isLoading={isLoading}
      actions={
        data && !error && !isLoading ? (
          <ActionPanel>
            <Action.Paste title="Paste to Active App" content={data} />
            <Action.CopyToClipboard title="Copy Translation" content={data} />
          </ActionPanel>
        ) : undefined
      }
    />
  );
}
