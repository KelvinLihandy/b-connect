import React from "react";

export const Divider = ({ className, divClassName }) => {
  return (
    <div
      className={`flex w-full items-center gap-4 sm:gap-6 relative ${className}`}
    >
      <div className="relative flex-1 grow h-px bg-gray-300" />

      <div
        className={`relative w-fit font-avenir text-gray-500 text-lg sm:text-xl md:text-2xl tracking-normal ${divClassName}`}
      >
        OR
      </div>

      <div className="relative flex-1 grow h-px bg-gray-300" />
    </div>
  );
};