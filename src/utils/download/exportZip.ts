import JsZip from "jszip";
import FileSaver from "file-saver";
import { format } from "date-fns";

export const exportZip = async (files: File[]) => {
  const zip = JsZip();
  files.forEach((file) => {
    zip.file(file.name, file);
  });
  const zipFile = await zip.generateAsync({ type: "blob" });

  const now = new Date();
  const prettyData = format(now, "yyyy-MM-dd");
  const fileName = `cuota-files_${prettyData}.zip`;

  return FileSaver.saveAs(zipFile, fileName);
};
