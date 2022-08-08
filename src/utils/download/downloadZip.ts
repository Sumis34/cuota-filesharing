import { InferQueryOutput } from "../trpc";
import { exportZip } from "./exportZip";
import { downloadMany } from "./downloadMany";

export type RemoteFile = Pick<
  InferQueryOutput<"files.getAll">,
  "files"
>["files"][0];

export type RemoteFiles = RemoteFile[];

export type DownloadProgress = (event: DownloadProgressEvent) => void;

export interface DownloadProgressEvent {
  loaded: number;
  total: number;
  fileCount: number;
  uploadedFiles: number;
}

const downloadZip = async (
  remoteFiles: RemoteFiles,
  onDownloadProgress?: DownloadProgress
) => {
  const files = await downloadMany(remoteFiles, onDownloadProgress);
  return exportZip(files);
};

export default downloadZip;
