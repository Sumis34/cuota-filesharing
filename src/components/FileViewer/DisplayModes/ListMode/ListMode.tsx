import { HiDownload } from "react-icons/hi";
import { DisplayModeProps } from "..";
import getNameFromKey from "../../../../utils/getNameFromKey";
import IconButton from "../../../UI/Button/IconButton";
import FileInfo from "../../FileInfo";

export default function ListMode({ files, onItemClick }: DisplayModeProps) {
  return (
    <ul className="flex flex-col gap-2">
      {files.map((file, i) => {
        const { key, url, contentLength, contentType } = file;
        return (
          <li
            onClick={() => onItemClick(file)}
            className="rounded-lg bg-slate-200/30 border py-3 px-5 flex items-center justify-between cursor-pointer hover:shadow-lg shadow-gray-400/20 transition-all"
          >
            <FileInfo
              name={getNameFromKey(key)}
              size={contentLength || 0}
              type={contentType || ""}
            />
            <a href={url || "#"}>
              <IconButton>
                <HiDownload className="fill-indigo-500" />
              </IconButton>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
