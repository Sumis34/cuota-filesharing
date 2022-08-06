import { FileError } from "react-dropzone";

export default function fileIsInList(
  name: string,
  files: File[] | undefined | null
): null | FileError {
  return !files?.some((f) => f.name === name)
    ? null
    : {
        code: "file-already-exists",
        message: "Only submit the same file once",
      };
}
