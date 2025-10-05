import React from "react";

export const Nodejs = () => {
  return (
    <div className=" flex items-center px-7 gap-x-5 py-5 backdrop-blur-xl bg-neutral-900/60 border border-white/[0.08] hover:border-white/[0.12] p-7 transition-all duration-300 hover:shadow-xl ">
      <div className=" flex flex-col items-center justify-center pixelFont text-2xl">
        <p>NodeJs + ExpressJs</p>
      </div>
      <p className="ibmFont text-sm uppercase">
        Connect to an isolated sandbox to securely make apis.
      </p>
      <button className="group cursor-pointer relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white font-medium text-black transition-all duration-300 hover:w-32">
        <div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100">
          Start
        </div>
        <div className="absolute right-3.5">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </button>
    </div>
  );
};
