import Editor from "@monaco-editor/react";

function MonacoEditor({ code, setCode, selectedPath, socketRef }: any) {
  function handleEditorChange(value: string | undefined) {
    const cleanPath = selectedPath.slice(10);
    setCode(value || ""); // handle undefined safely
    socketRef.current.emit(
      "writeInFile",
      { path: cleanPath, data: value },
      (res: any) => {
        console.log("writeInFile res", res);
      }
    );
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
