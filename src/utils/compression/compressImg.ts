import imageCompression from "browser-image-compression";
import path from "path";

interface CompressImgOptions {
  nameExtension: string;
  onStart?: (options: any) => void;
  onSuccess?: (compressedFile: File) => void;
  onError?: (error: Error) => void;
}

export default async function compressImg(
  file: File,
  options?: CompressImgOptions
) {
  if (!file || !file.type.startsWith("image")) return;

  const compressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 600,
    useWebWorker: true,
    // fileType: "image/webp",
  };

  try {
    if (options?.onStart) options.onStart(compressionOptions);

    const compressedFile = await imageCompression(file, compressionOptions);

    const currentName = path.parse(compressedFile.name);

    const name = currentName.name + options?.nameExtension + currentName.ext;

    Object.defineProperty(compressedFile, "name", {
      writable: true,
      value: name,
    });

    if (options?.onSuccess) options.onSuccess(compressedFile);

    return compressedFile;
  } catch (error) {
    if (options?.onError) options.onError(error as Error);

    console.error(error);

    return null;
  }
}
