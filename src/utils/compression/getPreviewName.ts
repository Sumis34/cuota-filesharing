import path from "path";

/**
 *
 * @param key full path to the file including the file name and extension (.jpg, .png, .webp)
 * @param nameExtension extension to add to the file name (e.g. _compressed)
 * @returns key with the name extension added.
 */
export default function getPreviewName(key: string, nameExtension?: string) {
  const currentName = path.parse(key);
  return currentName.name + (nameExtension || "") + currentName.ext;
}
