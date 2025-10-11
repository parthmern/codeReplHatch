import Editor from "@monaco-editor/react";

function MonacoEditor({ code, setCode }: any) {
  function handleEditorChange(value: string | undefined) {
    setCode(value || ""); // handle undefined safely
  }

  return (
    <Editor
      height="100%" // optional, ensures full height usage
      defaultLanguage="javascript"
      value={code}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 12,
        automaticLayout: true, // auto resize
        tabSize: 2,
        formatOnType: true,
        formatOnPaste: true,
      }}
    />
  );
}

export default MonacoEditor;
