import { useRouter } from "next/router";
import { HiViewBoards, HiViewGrid, HiViewList } from "react-icons/hi";
import IconButton from "../UI/Button/IconButton";

interface PreviewModeButtonProps {
  onChange?: () => void;
}

const modes = ["gallery", "grid", "list"] as const;

export type PreviewMode = typeof modes[number];

export default function PreviewModeButton({
  onChange,
}: PreviewModeButtonProps) {
  const router = useRouter();

  const mode = router.query.mode as PreviewMode;

  const handleClick = () => {
    const nextMode = modes[
      (modes.indexOf(mode) + 1) % modes.length
    ] as PreviewMode;

    router.push({
      pathname: "/files/[fileId]",
      query: { mode: nextMode, fileId: router.query.fileId },
    });

    if (onChange) onChange();
  };

  return (
    <IconButton
      className="active:translate-y-0.5 transition-transform bg-gray-100 hover:bg-gray-200"
      onClick={handleClick}
    >
      {mode === "gallery" ? (
        <HiViewBoards className="text-2xl fill-gray-800/80 mx-1" />
      ) : mode === "grid" ? (
        <HiViewGrid className="text-2xl fill-gray-800/80 mx-1" />
      ) : (
        <HiViewList className="text-2xl fill-gray-800/80 mx-1" />
      )}
    </IconButton>
  );
}
