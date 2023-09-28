import { ButtonHTMLAttributes, createElement } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

interface IconButtonWithTooltipProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  children: React.ReactNode;
}

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
  return createElement(
    as,
    {
      type: as === "button" ? "button" : undefined,
      className: `active:translate-y-0.5 transition-all p-1 rounded-md ${className} ${
        variant === "primary"
          ? "bg-indigo-100 dark:bg-indigo-400 hover:bg-indigo-100/70 dark:hover:bg-indigo-300"
          : variant === "secondary"
          ? "border border-neutral-700 p-2 rounded-md hover:bg-neutral-800/50 active:bg-neutral-800"
          : "hover:text-black dark:hover:text-white"
      }`,
      onClick,
    },
    children
  );
}

export function IconButtonWithTooltip({
  tooltip,
  children,
  className,
  onClick,
  ...props
}: IconButtonWithTooltipProps) {
  return tooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`border border-neutral-700 p-2 rounded-md hover:bg-neutral-800/50 active:bg-neutral-800 ${className}`}
            {...props}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <button
      onClick={onClick}
      className={`border border-neutral-700 p-2 rounded-md hover:bg-neutral-800/50 active:bg-neutral-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
