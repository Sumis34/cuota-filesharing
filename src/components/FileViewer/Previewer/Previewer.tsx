import mime from "mime-types";
import { HiAdjustments, HiDocument, HiVideoCamera } from "react-icons/hi";
import PDFViewer from "../../PDFViewer";

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
  console.log(type);

  return (
    <div className="overflow-hidden h-full">
      {isImage(type) ? (
        <img src={contentUrl} className="object-cover w-full h-full" />
      ) : isPDF(type) ? (
        <PDFViewer path={contentUrl} />
      ) : isVideo(type) ? (
        <div className="relative h-full">
          <div className="inset-0 absolute p-5">
            <div className="p-2 bg-gray-200/5 ml-auto w-fit rounded-lg" title="Video">
              <HiVideoCamera className="fill-gray-200" />
            </div>
          </div>
          <video className="object-cover w-full h-full">
            <source src={contentUrl} type={"video/mp4"} />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            <HiDocument className="fill-gray-200 text-9xl" />
            <span className="text-gray-200 text-center block">
              {mime.extension(type || "")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
