import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LegacyRef, useEffect, useRef } from "react";
import UploadFileItem from "./UploadFileItem";

export default function UploadFileList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (i: number) => void;
}) {
  const [parent] = useAutoAnimate();

  return (
    <ul
      ref={parent as LegacyRef<HTMLUListElement>}
      className="relative max-h-44 overflow-y-auto divide-y divide-neutral-700 dark:divide-neutral-800 scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-700 dark:scrollbar-track-neutral-800 scrollbar-thin scrollbar-thumb-rounded-md pr-4 mb-2"
    >
      {files.map(({ name, type, size }, i) => (
        <UploadFileItem
          key={name}
          name={name}
          type={type}
          size={size}
          remove={() => onRemove(i)}
        />
      ))}
    </ul>
  );
}
