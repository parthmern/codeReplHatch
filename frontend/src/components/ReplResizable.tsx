import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TerminalComponent from "./Terminal";

export function ReplResizable() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>

      {/* Add withHandle prop for a visible handle */}
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex bg-white relative visible border-amber-300 border-2 z-50 h-full items-center justify-center p-6">
              <iframe src="http://userpod.ingress-nginx.parthmern.store/app" />
            </div>
          </ResizablePanel>

          {/* Visible handle for vertical split */}
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={75}>
            <TerminalComponent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
