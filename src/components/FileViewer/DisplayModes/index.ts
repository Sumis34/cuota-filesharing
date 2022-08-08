import ListMode from "./ListMode";
import GalleryMode from "./GalleryMode";
import GridMode from "./GridMode";
import { RemoteFile, RemoteFiles } from "../../../utils/download/downloadZip";

export interface DisplayModeProps {
  files: RemoteFiles;
  onItemClick: (file: RemoteFile) => void;
}

export { GridMode, ListMode, GalleryMode };
