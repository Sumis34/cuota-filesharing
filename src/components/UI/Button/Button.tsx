import Link from "next/link";

interface ButtonProps {
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
  const styles = `px-6 py-1 w-fit bg-gradient-to-t from-indigo-500 to-indigo-300 text-white font-serif rounded-lg text-lg font-bold cursor-pointer active:translate-y-0.5 transition-all ${className}`;
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
