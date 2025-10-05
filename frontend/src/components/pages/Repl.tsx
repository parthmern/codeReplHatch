import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TypingAnimation } from "../ui/typing-animation";
import { NodejsTerminalLoader } from "../NodejsTerminalLoader";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { ReplResizable } from "../ReplResizable";

export const Repl = () => {
  const { id, lang } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [fileSystemData, setFileSystemData] = useState([]);
  const [allFilesAndFolders, setAllFilesAndFolders] = useState([]);

  useEffect(() => {
    let socket: Socket; // will hold the socket connection

    async function intializingProject() {
      try {
        // const res = await axios.post("http://localhost:3000/project/init", {
        //   language: lang,
        //   projectId: id,
        // });

        // console.log("Project init success:", res.data);

        // Only connect socket after API succeeds
        socket = io("http://userpod.ingress-nginx.parthmern.store", {
          transports: ["websocket"], // ensures websocket transport
        });

        socket.on("fileSystem", (obj) => {
          console.log("fileSystem event:", obj);
          setFileSystemData(obj);
        });

        socket.on("allFileAndFolders", (obj) => {
          console.log("allFileAndFolders event:", obj);
          setAllFilesAndFolders(obj);
        });

        socket.on("connect", () => {
          console.log("✅ Socket connected:", socket.id);
          setIsReady(false);

          socket.emit("fetchEverything", { path: "/workspace" }, (res: any) => {
            console.log(res);
          });

          socket.emit(
            "allFileAndFolders",
            { path: "/workspace" },
            (res: any) => {
              console.log(res);
            }
          );

          socket.emit("fetchContent", { path: "server.js" }, (res: any) => {
            console.log(res);
          });
        });
      } catch (error) {
        console.log("Project init error =>", error);
      }
    }

    //intializingProject();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [id, lang]);

  return (
    <div className="h-screen w-screen">
      {isReady ? (
        <div className="flex flex-col mt-7 items-center justify-center ">
          <TypingAnimation className="ibmFont uppercase">
            Creating NodeJs + ExpressJs Sandbox Workspace .....
          </TypingAnimation>
          <NodejsTerminalLoader />
        </div>
      ) : (
        <div className="p-5 h-screen">
          <ReplResizable />
        </div>
      )}
    </div>
  );
};
