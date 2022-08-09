import exifr from "exifr";
import { useEffect, useState } from "react";
import { pathToFileURL } from "url";

export default function ImgViewer({ path }: { path: string }) {
  return <img src={path} className={"object-cover w-full h-full"} />;
}

export function FullImgViewer({
  path,
  onMetaChange,
}: {
  path: string;
  onMetaChange: (meta: any) => void;
}) {
  useEffect(() => {
    const getMeta = async () => {
      try {
        const data = await exifr.parse(path, true);
        onMetaChange(data);
      } catch {
        return null;
      }
    };
    getMeta();
  }, [pathToFileURL]);

  return <img src={path} className={"object-contain w-full h-full"} />;
}
