import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import axios, { AxiosRequestConfig } from "axios";

const uploadFile = async (
  file: File,
  presignedData: PresignedPost,
  config?: AxiosRequestConfig
) => {
  const formData = new FormData();

  Object.keys(presignedData.fields).forEach((key) => {
    formData.append(key, presignedData.fields[key] || "");
  });

  formData.append("file", file);
  return await axios.post(presignedData.url, formData, config);
};

export { uploadFile };
