import JsZip from "jszip";
import FileSaver from "file-saver";
import { InferQueryOutput } from "../trpc";
import axios, { AxiosRequestConfig } from "axios";

export type RemoteFiles = Pick<
  InferQueryOutput<"files.getAll">,
  "files"
>["files"];

type DownloadProgress = (
  loaded: number,
  total: number,
  fileCount: number,
  progresses: number[]
) => void;

const download = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<Blob> => {
  const res = await axios.get(url, {
    ...config,
    responseType: "blob",
  });
  return res.data;
};

const downloadMany = (
  files: RemoteFiles,
  onDownloadProgress?: DownloadProgress
) => {
  const progresses: number[] = [];
  let totalBytes = 0;

  return Promise.all(
    files.map(async (file, i) => {
      totalBytes += file.contentLength || 0;

      const blob = await download(file.url, {
        onDownloadProgress: (e) => {
          progresses[i] = e.loaded;
          const fileCount = progresses.length;        
          
          if (!onDownloadProgress) return;
          onDownloadProgress(
            progresses.reduce((sum, acc) => sum + acc),
            totalBytes,
            fileCount,
            progresses
          );
        },
      });

      const name = file.key?.split("/").at(-1) || "file_" + i;
      return new File([blob], name);
    })
  );
};

const exportZip = (files: File[]) => {
  const zip = JsZip();
  files.forEach((file) => {
    zip.file(file.name, file);
  });
  zip.generateAsync({ type: "blob" }).then((zipFile: any) => {
    const currentDate = new Date().getTime();
    const fileName = `combined-${currentDate}.zip`;
    return FileSaver.saveAs(zipFile, fileName);
  });
};

const downloadZip = async (
  remoteFiles: RemoteFiles,
  onDownloadProgress?: DownloadProgress
) => {
  const files = await downloadMany(remoteFiles, onDownloadProgress);
  return exportZip(files);
};

export default downloadZip;
