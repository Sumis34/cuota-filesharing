import JsZip from "jszip";
import FileSaver from "file-saver";
import { InferQueryOutput } from "../trpc";
import axios from "axios";

export type RemoteFiles = Pick<
  InferQueryOutput<"files.getAll">,
  "files"
>["files"];

const download = async (url: string) => {
  const res = await axios.get(url, {
    responseType: "blob",
     
  });
  return res.data;
};

const downloadMany = (files: RemoteFiles) =>
  Promise.all(
    files.map(async (file, i) => {
      const blob = await download(file.url);
      const name = file.key?.split("/").at(-1) || "file_" + i;
      return new File([blob], name);
    })
  );

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

const downloadZip = async (remoteFiles: RemoteFiles) => {
  const files = await downloadMany(remoteFiles);
  return exportZip(files);
};

export default downloadZip;
