interface ButtonProps {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  onClick,
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-6 py-1 w-fit bg-gradient-to-t from-indigo-500 to-indigo-300 text-white font-serif rounded-lg text-lg font-bold cursor-pointer active:translate-y-0.5 transition-all ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
