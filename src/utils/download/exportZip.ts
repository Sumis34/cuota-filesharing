import JsZip from "jszip";
import FileSaver from "file-saver";

export const exportZip = (files: File[]) => {
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
