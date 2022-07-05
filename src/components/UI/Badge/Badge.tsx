export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-purple-200 rounded-full px-2 text-purple-500 translate-y-0.5">
      {children}
    </span>
  );
}
