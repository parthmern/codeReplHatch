import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // your backend

const TerminalComponent: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal>();

  useEffect(() => {
    const term = new Terminal({
      cols: 100,
      rows: 30,
      cursorBlink: true,
      scrollback: 1000,
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

  return <div ref={terminalRef} style={{ width: "100%", height: "500px" }} />;
};

export default TerminalComponent;
