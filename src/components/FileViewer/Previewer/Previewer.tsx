import mime from "mime-types";
import { ImgViewer, PDFViewer, UnknownViewer, VideoViewer } from "../Viewers";
import AudioViewer from "../Viewers/AudioViewer";

const isImage = (type: string) => type.match("image/*");
const isPDF = (type: string) => type === mime.contentType("pdf");
const isVideo = (type: string) => type.match("video/*");
const isAudio = (type: string) => type.match("audio/*");

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
        <PDFViewer mode={mode} path={contentUrl} />
      ) : isVideo(type) ? (
        <VideoViewer mode={mode} path={contentUrl} />
      ) : isAudio(type) ? (
        <AudioViewer mode={mode} path={contentUrl} />
      ) : (
        <UnknownViewer type={type} />
      )}
    </div>
  );
}

export { isImage, isPDF, isVideo };
