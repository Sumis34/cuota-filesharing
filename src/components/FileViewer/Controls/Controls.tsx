import { useState } from "react";
import { HiViewBoards, HiViewGrid, HiViewList } from "react-icons/hi";
import PreviewModeButton, {
  PreviewMode,
} from "../../PreviewModeButton.tsx/PreviewModeButton";

export default function Controls() {
  const [displayMode, setDisplayMode] = useState<PreviewMode>("grid");

  return (
    <div className="flex mb-6">
      <PreviewModeButton mode={displayMode} onChange={setDisplayMode} />
    </div>
  );
}
