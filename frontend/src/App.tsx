import "./App.css";
import { Header } from "./components/Header";
import VideoBackground from "./components/VideoBackground";

function App() {
  return (
    <div className=" overflow-x-hidden">
      {/* <TreeViewBasic /> */}
      {/* <TerminalComponent /> */}
      <Header />
      <div>
        <VideoBackground />
      </div>
      <div
        className="relative h-8 w-full border-x border-edge border-t border-t-[rgba(255,255,255,0.75)] 
  before:absolute before:inset-0 before:bg-[repeating-linear-gradient(315deg,rgba(255,255,255,0.50)_0,rgba(255,255,255,0.75)_1px,transparent_0,transparent_50%)] before:bg-[length:10px_10px]"
      ></div>
    </div>
  );
}

export default App;
