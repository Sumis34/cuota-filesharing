import axios, { AxiosRequestConfig } from "axios";

const uploadFile = async (
  file: File,
  url: string,
  config?: AxiosRequestConfig
) => {
  config = {
    ...config,
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename=${file.name}`,
    },
  };
  return await axios.put(url, file, config);
};

const calcTotalProgress = (
  uploadProgresses: number[] | undefined,
  totalSize: number | null | undefined
) => {
  if (!totalSize || !uploadProgresses) return 0;

  const loaded = uploadProgresses.reduce((acc, curr) => acc + curr, 0);
  return Math.round((loaded * 100) / totalSize);
};

export { uploadFile, calcTotalProgress };
