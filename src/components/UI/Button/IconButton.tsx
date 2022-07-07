interface IconButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}
export default function IconButton({
  onClick,
  children,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`bg-indigo-100 active:translate-y-0.5 hover:bg-indigo-100/70 transition-all p-1 rounded-md ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
