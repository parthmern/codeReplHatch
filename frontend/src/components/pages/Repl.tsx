import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TypingAnimation } from "../ui/typing-animation";
import { NodejsTerminalLoader } from "../NodejsTerminalLoader";
import axios from 'axios';


export const Repl = () => {
  const [isReady, setIsReady] = useState(true);

  async function intializingProject() {
    try {
        const res = await axios.post('http://localhost:3000/init/project')
    } catch (error) {
      console.log("error =>", error);
    }
  }

  useEffect(() => {}, []);
  const { id } = useParams();
  return (
    <div>
      {isReady ? (
        <div className="flex flex-col mt-7 items-center justify-center ">
          <TypingAnimation className="ibmFont uppercase">
            Creating NodeJs + ExpressJs Sandbox Workspace .....
          </TypingAnimation>
          <NodejsTerminalLoader />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
