import { useState } from "react";
import { HiViewBoards, HiViewGrid, HiViewList } from "react-icons/hi";
import PreviewModeButton, {
  PreviewMode,
} from "../../PreviewModeButton.tsx/PreviewModeButton";

export default function Controls() {
  return (
    <div className="flex mb-6">
      <PreviewModeButton />
    </div>
  );
}
