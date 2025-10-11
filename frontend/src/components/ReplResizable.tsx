import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TerminalComponent from "./Terminal";
import TreeViewBasic from "./Tree";
import { useState } from "react";

export function ReplResizable({ allFilesAndFolders }: any) {
  const [allFiles, setAllFiles] = useState();
  console.log("ReplResizable", allFilesAndFolders);
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col justify-self-start ">
          <div className="uppercase ml-4 py-2 ibmFont items-center align-middle justify-center">
            Project Name
          </div>
          <TreeViewBasic allFilesAndFolders={allFilesAndFolders} />
        </div>
      </ResizablePanel>

      {/* Add withHandle prop for a visible handle */}
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={62}>
            <div className="flex bg-white relative visible  border-2 z-50 h-full items-center justify-center p-6">
              <iframe src="http://userpod.ingress-nginx.parthmern.store/app" />
            </div>
          </ResizablePanel>

          {/* Visible handle for vertical split */}
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={38}>
            <TerminalComponent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
