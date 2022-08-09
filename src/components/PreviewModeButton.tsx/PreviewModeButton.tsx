import { RadioGroup } from "@headlessui/react";
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

  const handleChange = (mode: string) => {
    router.push({
      pathname: "/files/[fileId]",
      query: { mode: mode, fileId: router.query.fileId },
    });

    if (onChange) onChange();
  };

  return (
    <>
      <RadioGroup className={"flex"} value={mode} onChange={handleChange}>
        <RadioGroup.Option value="grid">
          {({ checked }) => (
            <IconButton
              className={`active:translate-y-0.5 transition-transform bg-gray-100 hover:bg-gray-200 rounded-r-none ${
                checked ? "bg-indigo-200" : ""
              }`}
            >
              <HiViewGrid className="text-2xl group-hover:text-indigo-500 transition-all text-indigo-800 mx-1" />
            </IconButton>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="gallery">
          {({ checked }) => (
            <IconButton
              className={`active:translate-y-0.5 transition-transform bg-gray-100 hover:bg-gray-200 rounded-none ${
                checked ? "bg-indigo-200" : ""
              }`}
            >
              <HiViewBoards className="text-2xl group-hover:text-indigo-500 transition-all text-indigo-800 mx-1" />
            </IconButton>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="list">
          {({ checked }) => (
            <IconButton
              className={`active:translate-y-0.5 transition-transform bg-gray-100 hover:bg-gray-200 rounded-l-none ${
                checked ? "bg-indigo-200" : ""
              }`}
            >
              <HiViewList className="text-2xl group-hover:text-indigo-500 transition-all text-indigo-800 mx-1" />
            </IconButton>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </>
  );
}
