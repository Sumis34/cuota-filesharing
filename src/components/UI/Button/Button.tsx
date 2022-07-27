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
  const styles = `px-6 py-1 w-fit text-white font-serif rounded-lg text-lg font-bold cursor-pointer enabled:active:translate-y-0.5 transition-all disabled:opacity-25 disabled:cursor-default ${className} ${
    variant === "primary"
      ? "bg-gradient-to-t from-indigo-500 to-indigo-300"
      : variant === "secondary"
      ? "text-indigo-500 border-2 border-indigo-500"
      : ""
  }`;
  return href ? (
    <Link href={href}>
      <a>
        <button className={styles}>{children}</button>
      </a>
    </Link>
  ) : (
    <button className={styles} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
