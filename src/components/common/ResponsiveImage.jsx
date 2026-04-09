import React, { useMemo, useState } from "react";

const fitClass = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

export default function ResponsiveImage({
  src,
  alt = "",
  className = "",
  fit = "cover",
  fallbackSrc,
  style,
  ...props
}) {
  const [failed, setFailed] = useState(false);

  const finalSrc = useMemo(() => {
    if (!src) return fallbackSrc;
    if (failed) return fallbackSrc ?? src;
    return src;
  }, [src, fallbackSrc, failed]);

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`block max-w-full h-auto ${fitClass[fit] ?? fitClass.cover} ${className}`}
      style={style}
      loading={props.loading ?? "lazy"}
      decoding={props.decoding ?? "async"}
      onError={(e) => {
        if (fallbackSrc && !failed) setFailed(true);
        props.onError?.(e);
      }}
      {...props}
    />
  );
}
