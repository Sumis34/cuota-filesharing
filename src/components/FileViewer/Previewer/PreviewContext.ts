import React from "react";

export const PreviewContext = React.createContext<{
  img: {
    styles?: React.CSSProperties;
    className?: string;
  };
}>({
  img: {
    styles: {
      objectFit: "cover",
    },
    className: "w-full h-full",
  },
});
