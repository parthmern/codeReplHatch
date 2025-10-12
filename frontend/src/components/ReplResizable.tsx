import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TerminalComponent from "./Terminal";
import TreeViewBasic from "./Tree";
import { useEffect, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import PulseDot from "react-pulse-dot";
import "react-pulse-dot/dist/index.css";
import axios from "axios";
import { useParams } from "react-router-dom";

export function ReplResizable({
  allFilesAndFolders,
  selectedPath,
  setSelectedPath,
  code,
  setCode,
  socketRef,
}: any) {
  const {id} = useParams();
  const [src, setSrc] = useState(
    `http://${id}.ingress-nginx.parthmern.store/app`
  );

  const [ok, setOk] = useState(false);

  useEffect(() => {
    axios
      .get(`http://${id}.ingress-nginx.parthmern.store/app`)
      .then((res) => setOk(res.status === 200))
      .catch(() => setOk(false));
  }, [src]);

  const refreshIframe = () => {
    setSrc("http://userpod.ingress-nginx.parthmern.store/");
    setTimeout(() => {
      setSrc(`http://${id}.ingress-nginx.parthmern.store/app`);
    }, 0);
  };

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
          <MonacoEditor
            code={code}
            setCode={setCode}
            socketRef={socketRef}
            selectedPath={selectedPath}
          />
        </div>
      </ResizablePanel>

      {/* Add withHandle prop for a visible handle */}
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={62}>
            <div className="flex px-2 justify-between h-[36px] py-2">
              <div className="flex ">
                <PulseDot
                  className="mt-[-5px]"
                  color={ok ? "success" : "danger"}
                />
                <p
                  onClick={() => window.open(src, "_blank")}
                  className="cursor-pointer hover:text-green-400"
                >
                  Web
                </p>
              </div>
              <div className="flex gap-x-2">
                <button
                  onClick={refreshIframe}
                  className="cursor-pointer rounded-[8px] bg-neutral-200 px-3  text-sm text-neutral-950 transition-colors hover:bg-neutral-100 active:bg-neutral-50"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="flex bg-white relative visible  border-2 z-50 h-full items-center justify-center p-6">
              <iframe src={src} />
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
