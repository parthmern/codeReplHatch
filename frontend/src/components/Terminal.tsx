import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";


const TerminalComponent: React.FC = () => {
  const {id} = useParams();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal>();

  useEffect(() => {

    const socket = io(id+".ingress-nginx.parthmern.store"); 

    const term = new Terminal({
      cursorBlink: true,

      theme: {
        background: "#0d0208",
        foreground: "#00ff41",
        cursor: "#00ff41",
        cursorAccent: "#00ff41",
      },
      fontFamily:
        "monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontSize: 12,
      letterSpacing: 0,
      fontWeight: "100",
      cursorStyle: "block",
      cursorWidth: 2,
      scrollOnUserInput: true,
      cols: 5,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    term.onData((data) => {
      // send user input to backend
      socket.emit("terminal-input", data);
    });

    socket.on("terminal-result", (data: { result: string }) => {
      term.write(data.result);
    });

    xtermRef.current = term;

    return () => {
      term.dispose();
      socket.off("terminal-result");
    };
  }, []);

  return <div ref={terminalRef} style={{ height: "200px" }} />;
};

export default TerminalComponent;
