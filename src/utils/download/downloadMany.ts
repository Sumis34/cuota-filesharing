import getNameFromKey from "../getNameFromKey";
import { download } from "./download";
import { RemoteFiles, DownloadProgress } from "./downloadZip";

export const downloadMany = (
  files: RemoteFiles,
  onDownloadProgress?: DownloadProgress
) => {
  const progresses: number[] = [];
  let totalBytes = 0;
  let uploadedFiles = 0;

  return Promise.all(
    files.map(async (file, i) => {
      totalBytes += file.contentLength || 0;

      const blob = await download(file.url, {
        onDownloadProgress: (e) => {
          progresses[i] = e.loaded;
          const fileCount = files.length;

          if (e.loaded === file.contentLength) uploadedFiles++;

          if (!onDownloadProgress) return;
          onDownloadProgress({
            loaded: progresses.reduce((sum, acc) => sum + acc),
            total: totalBytes,
            fileCount: fileCount,
            uploadedFiles: uploadedFiles,
          });
        },
      });

      const name = getNameFromKey(file.key);
      return new File([blob], name);
    })
  );
};
