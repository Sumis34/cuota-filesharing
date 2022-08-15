import path from "path";
import { COMPRESSED_FILE_EXTENSION } from "../constants";

export const isPreview = (name: string) => path.parse(name).name.endsWith(COMPRESSED_FILE_EXTENSION);
