import React from "react";

export const Divider = ({ className, divClassName }) => {
  return (
    <div
      className={`flex w-[669px] items-center gap-[23px] relative ${className}`}
    >
      <div className="relative flex-1 grow h-0.5 bg-[#66666640]" />

      <div
        className={`relative w-fit mt-[-1.00px] [font-family:'Avenir-Roman',Helvetica] font-normal text-[#666666] text-2xl tracking-[0] leading-[normal] ${divClassName}`}
      >
        OR
      </div>

      <div className="relative flex-1 grow h-0.5 bg-[#66666640]" />
    </div>
  );
};