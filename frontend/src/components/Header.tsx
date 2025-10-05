import { GoogleSvg } from "./svgs/GoogleSvg";

export const Header = () => {
  return (
    <div className="flex absolute z-100 w-full justify-between mt-6 px-30 pb-4 border-b-[0.1px]  border-b-white/20 text-white ">
      <div className="text-xl font-[500]">CodeReplHatch</div>
      <div className="flex">
        <button className="group flex items-center justify-center cursor-pointer relative  border border-neutral-200 bg-white  px-4 text-black">
          <span className="relative inline-flex overflow-hidden">
            <div className="translate-y-0 skew-y-0 inline-flex transition duration-500 group-hover:-translate-y-[110%] group-hover:skew-y-12">
              <GoogleSvg /> <span className="pl-2">Launch Now</span>
            </div>
            <div className="absolute inline-flex translate-y-[110%] skew-y-8 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
              <GoogleSvg /> <span className="pl-2">Launch Now</span>
            </div>
          </span>
        </button>
      </div>
    </div>
  );
};
