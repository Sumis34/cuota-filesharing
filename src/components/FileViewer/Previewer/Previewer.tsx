import mime from "mime-types";
import { ImgViewer, PDFViewer, UnknownViewer, VideoViewer } from "../Viewers";

const isImage = (type: string) => type.match("image/*");
const isPDF = (type: string) => type === mime.contentType("pdf");
const isVideo = (type: string) => type.match("video/*");

export default function Previewer({
  contentUrl,
  type,
}: {
  contentUrl: string;
  type: string;
}) {
  return (
    <div className="overflow-hidden h-full">
      {isImage(type) ? (
        <ImgViewer path={contentUrl} />
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
