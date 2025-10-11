import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function MonacoEditor() {
  const [code, setCode] = useState("// Write your code here");

  function handleEditorChange(value: React.SetStateAction<string>, event: any) {
    setCode(value);
  }

  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue={code}
      onChange={handleEditorChange}
      theme="vs-dark" // or "vs-light"
      options={{
        minimap: { enabled: false }, // Disable the minimap
        fontSize: 16,
      }}
    />
  );
}

export default MonacoEditor;
