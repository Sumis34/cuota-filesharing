import axios, { AxiosRequestConfig } from "axios";

export const download = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<Blob> => {
  const res = await axios.get(url, {
    ...config,
    responseType: "blob",
  });
  return res.data;
};
