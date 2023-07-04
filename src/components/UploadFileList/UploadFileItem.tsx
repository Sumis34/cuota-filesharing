import { HiMinus, HiOutlineExclamation } from "react-icons/hi";
import IconButton, { IconButtonWithTooltip } from "../UI/Button/IconButton";
import bytes from "pretty-bytes";
import mime from "mime-types";
import { Popover } from "../UI/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../UI/tooltip";

interface UploadFileItemProps {
  name: string;
  type: string;
  size: number;
  remove: () => void;
}

const GIGABYTE = 1024 * 1024 * 1024;

export default function UploadFileItem({
  name,
  type,
  size,
  remove,
}: UploadFileItemProps) {
  return (
    <li className="flex py-2 justify-between group gap-3">
      <div className="flex flex-col overflow-hidden">
        <p className="dark:opacity-100 opacity-80 leading-snug truncate">
          {name}
        </p>
        <div className="opacity-30 text-xs flex gap-3">
          <span>
            {bytes(size)} • {mime.extension(type)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end flex-grow">
        {size > GIGABYTE * 3 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="bg-orange-200 rounded-md p-1">
                  <HiOutlineExclamation className="stroke-orange-900" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Large files may take unusually long to upload</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center flex-none">
        <IconButton variant="secondary" onClick={remove} className="!p-1">
          <HiMinus className="stroke-current" />
        </IconButton>
      </div>
    </li>
  );
}
