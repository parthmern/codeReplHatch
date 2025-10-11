import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TerminalComponent from "./Terminal";
import TreeViewBasic from "./Tree";
import { useState } from "react";
import MonacoEditor from "./MonacoEditor";

export function ReplResizable({
  allFilesAndFolders,
  selectedPath,
  setSelectedPath,
  code,
  setCode,
}: any) {
  const [allFiles, setAllFiles] = useState();
  console.log("ReplResizable", allFilesAndFolders);
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full border md:min-w-[450px]"
    >
      <ResizablePanel className="flex" defaultSize={70}>
        <div className="flex flex-col justify-self-start w-[250px] ">
          <div className="uppercase ml-4 py-2 ibmFont items-center align-middle justify-center">
            Project Name
          </div>
          <TreeViewBasic
            allFilesAndFolders={allFilesAndFolders}
            setSelectedPath={setSelectedPath}
          />
        </div>
        <div className="flex  flex-col w-full">
          <div className="ibmFont text-amber-200 text-sm py-2 uppercase">
            {selectedPath ? "- " + selectedPath : "- workspace"}
          </div>
          <MonacoEditor code={code} setCode={setCode} />
        </div>
      </ResizablePanel>

      {/* Add withHandle prop for a visible handle */}
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={62}>
            <div className="flex bg-white relative visible  border-2 z-50 h-full items-center justify-center p-6">
              <iframe src="http://userpod.ingress-nginx.parthmern.store/app" />
            </div>
          </ResizablePanel>

          {/* Visible handle for vertical split */}
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={38}>
            <div className="p-2">
              <TerminalComponent />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
