import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export default function Button({
  onClick,
  variant = "primary",
  children,
  className,
  href,
  ...props
}: ButtonProps) {
  return href ? (
    <Link href={href}>
      <button
        className={`px-6 py-1 w-fit rounded-xl text-lg font-semibold cursor-pointer enabled:active:translate-y-0.5 transition-all disabled:opacity-25 disabled:cursor-default ${className} ${
          variant === "primary"
            ? "bg-violet-300 text-black"
            : variant === "secondary"
            ? "text-violet-300 border-2 border-violet-300 dark:text-violet-200"
            : ""
        }`}
      >
        {children}
      </button>
    </Link>
  ) : (
    <button
      className={`px-6 py-1 w-fit rounded-xl text-lg font-semibold cursor-pointer enabled:active:translate-y-0.5 transition-all disabled:opacity-25 disabled:cursor-default ${className} ${
        variant === "primary"
          ? "bg-violet-300 text-black"
          : variant === "secondary"
          ? "text-violet-300 border-2 border-violet-300 dark:text-violet-200"
          : ""
      }`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
