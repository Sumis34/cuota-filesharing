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
      className="relative max-h-44 overflow-y-auto divide-y-2 divide-neutral-700 scrollbar-thumb-gray-200 dark:scrollbar-track-neutral-700 scrollbar-thin scrollbar-thumb-rounded-md pr-4 mb-2"
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
