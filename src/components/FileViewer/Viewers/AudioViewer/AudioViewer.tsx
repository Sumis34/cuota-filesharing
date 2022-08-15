import {
  fetchFromUrl,
  IAudioMetadata,
  IPicture,
  selectCover,
} from "music-metadata-browser";
import { useEffect, useState } from "react";
import { ViewMode } from "../../Previewer/Previewer";
import { FaCompactDisc } from "react-icons/fa";

export default function AudioViewer({
  path,
  mode,
}: {
  path: string;
  mode: ViewMode;
}) {
  const [cover, setCover] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<IAudioMetadata | null>(null);
  useEffect(() => {
    const getMeta = async () => {
      const meta = await fetchFromUrl(path);

      setMetadata(meta);

      const cov = selectCover(meta.common.picture);

      if (!cov?.data) return;

      setCover(URL.createObjectURL(new Blob([new Uint8Array(cov.data)])));
    };
    getMeta();
  }, [path]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center flex-col">
        {cover ? (
          <img
            className={`${
              mode === "fullscreen" ? "w-32 rounded-2xl mb-2" : "w-full"
            }`}
            src={cover}
            alt="cover"
          />
        ) : (
          <FaCompactDisc
            className={`text-indigo-400 mb-1 ${
              mode === "fullscreen" ? "text-9xl" : "text-8xl"
            }`}
          />
        )}
        {mode == "fullscreen" && (
          <div className="text-center mb-3">
            <h3 className={`text-xl`}>{metadata?.common.title}</h3>
            <p className="opacity-30">by {metadata?.common.artist}</p>
          </div>
        )}
        <audio controls={mode === "fullscreen"}>
          <source src={path} type={"audio/mpeg"} />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
}
