import { createElement } from "react";

interface IconButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  as?: string;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}
export default function IconButton({
  onClick,
  children,
  className,
  as = "button",
  variant = "primary",
}: IconButtonProps) {
  return createElement(as, {
    type: as === "button" ? "button" : undefined,
    className: `active:translate-y-0.5 transition-all p-1 rounded-md ${className} ${
      variant === "primary"
        ? "bg-indigo-100 hover:bg-indigo-100/70"
        : "bg-gray-200 hover:bg-gray-200/60"
    }`,
    onClick,
    children,
  });
}
