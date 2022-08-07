import exifr from "exifr";

interface MetaData {
  [key: string]: string;
}

export default async function getImgMetadata(
  file: File
): Promise<MetaData | null> {
  const data = await exifr.parse(file);
  return data || null;
}
