import { useEffect, useState } from "react";
import { Terminal, TypingAnimation, AnimatedSpan } from "./ui/terminal";

const steps = [
  {
    text: "→ POST /project/init [Serverless Backends]",
    color: "text-blue-500",
    typing: true,
  },
  {
    text: "✔ Request body validated against initSchema",
    color: "text-green-500",
  },
  { text: "✔ Checked DB: projectExist or not", color: "text-green-500" },
  { text: "✔ Connecting to S3 service...", color: "text-green-500" },
  {
    text: "✔ Listing objects from nodejsDEFAULT/",
    color: "text-green-500",
  },
  { text: "✔ Found 5 files in folder", color: "text-green-500" },
  {
    text: "→ Copying from bucket/defaultFolder/file1 → projectId/file1",
    color: "text-yellow-500",
  },
  {
    text: "→ Copying from bucket/defaultFolder/file2 → projectId/file2",
    color: "text-yellow-500",
  },
  {
    text: "→ Copying from bucket/defaultFolder/file3 → projectId/file3",
    color: "text-yellow-500",
  },
  { text: "✔ All files copied successfully", color: "text-green-500" },
  {
    text: "→ Saving content to S3: projectId/",
    color: "text-yellow-500",
  },
  { text: "✔ Content saved at projectId/", color: "text-green-500" },
  {
    text: "→ Project intializing ..... ",
    color: "text-pink-500",
    typing: true,
  },
];

export function NodejsTerminalLoader() {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);

  useEffect(() => {
    if (visibleSteps < steps.length) {
      const timer = setTimeout(() => {
        setVisibleSteps((prev) => prev + 1);
      }, 1000); // 1s per step for realism
      return () => clearTimeout(timer);
    }
  }, [visibleSteps]);

  return (
    <Terminal>
      <TypingAnimation>&gt; Initializing project...</TypingAnimation>
      {steps.slice(0, visibleSteps).map((step, i) =>
        step.typing ? (
          <TypingAnimation key={i} className={step.color}>
            {step.text}
          </TypingAnimation>
        ) : (
          <AnimatedSpan key={i} className={step.color}>
            {step.text}
          </AnimatedSpan>
        )
      )}
    </Terminal>
  );
}
