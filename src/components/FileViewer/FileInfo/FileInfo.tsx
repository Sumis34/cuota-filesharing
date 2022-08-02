import bytes from "pretty-bytes";
import mime from "mime-types";

interface FileInfoProps {
  type: string;
  size: number;
  name: string;
}

export default function FileInfo({ type, name, size }: FileInfoProps) {
  return (
    <div className="overflow-hidden">
      <p className="truncate text-sm">{name}</p>
      <div className="opacity-40 text-xs flex gap-3">
        <span>
          {bytes(size)} • {mime.extension(type)}
        </span>
      </div>
    </div>
  );
}
