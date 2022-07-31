import { HiDocument } from "react-icons/hi";
import mime from "mime-types";

export default function UnknownViewer({ type }: { type: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <HiDocument className="fill-gray-200 text-9xl" />
        <span className="text-gray-200 text-center block">
          {mime.extension(type || "")}
        </span>
      </div>
    </div>
  );
}
