import ListMode from "./ListMode";
import GalleryMode from "./GalleryMode";
import GridMode from "./GridMode";
import { RemoteFiles } from "../../../utils/download/downloadZip";

export interface DisplayModeProps {
  files: RemoteFiles;
}

export { GridMode, ListMode, GalleryMode };
