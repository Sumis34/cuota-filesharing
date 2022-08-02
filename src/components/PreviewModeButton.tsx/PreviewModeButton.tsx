import { HiViewBoards, HiViewGrid, HiViewList } from "react-icons/hi";
import IconButton from "../UI/Button/IconButton";

interface PreviewModeButtonProps {
  onChange: (mode: PreviewMode) => void;
  mode: PreviewMode;
}

const modes = ["gallery", "grid", "list"] as const;

export type PreviewMode = typeof modes[number];

export default function PreviewModeButton({
  onChange,
  mode,
}: PreviewModeButtonProps) {
  const icon =
    mode === "gallery" ? (
      <HiViewBoards className="text-3xl fill-gray-800" />
    ) : mode === "grid" ? (
      <HiViewGrid className="text-3xl fill-gray-800" />
    ) : (
      <HiViewList className="text-3xl fill-gray-800" />
    );

  const handleClick = () => {
    const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
    if (!nextMode) return;
    onChange(nextMode);
  };

  return (
    <IconButton
      className="active:translate-y-0.5 transition-transform"
      onClick={handleClick}
    >
      {icon}
    </IconButton>
  );
}
