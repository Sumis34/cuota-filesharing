import mime from "mime-types";
import { ImgViewer, PDFViewer, UnknownViewer, VideoViewer } from "../Viewers";

const isImage = (type: string) => type.match("image/*");
const isPDF = (type: string) => type === mime.contentType("pdf");
const isVideo = (type: string) => type.match("video/*");

export type ViewMode = "preview" | "fullscreen";

export default function Previewer({
  contentUrl,
  previewUrl,
  type,
  onMetaChange,
  mode = "preview",
}: {
  contentUrl: string;
  previewUrl?: string;
  type: string;
  mode?: ViewMode;
  onMetaChange?: (meta: any) => void;
}) {
  return (
    <div className="overflow-hidden h-full w-full">
      {isImage(type) ? (
        <ImgViewer
          mode={mode}
          onMetaChange={onMetaChange}
          path={previewUrl || contentUrl}
        />
      ) : isPDF(type) ? (
        <PDFViewer path={contentUrl} />
      ) : isVideo(type) ? (
        <VideoViewer path={contentUrl} />
      ) : (
        <UnknownViewer type={type} />
      )}
    </div>
  );
}

export { isImage, isPDF, isVideo };
