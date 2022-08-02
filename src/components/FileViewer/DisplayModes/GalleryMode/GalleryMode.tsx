import { DisplayModeProps } from "..";
import Previewer from "../../Previewer";

export default function GalleryMode({ files }: DisplayModeProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-5">
      {files.map(({ key, url, contentLength, contentType }) => (
        <div className="break-inside-avoid mb-5">
          {contentType && <Previewer type={contentType} contentUrl={url} />}
        </div>
      ))}
    </div>
  );
}
