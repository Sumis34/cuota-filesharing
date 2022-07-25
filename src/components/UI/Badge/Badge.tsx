export default function Badge({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning";
}) {
  return (
    <span
      className={`text-xs translate-y-0.5 rounded-full px-2 ${
        variant === "info"
          ? "text-purple-500 bg-purple-200"
          : "bg-yellow-200 text-black-500"
      }`}
    >
      {children}
    </span>
  );
}
