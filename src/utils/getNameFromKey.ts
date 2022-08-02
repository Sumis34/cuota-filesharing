const getNameFromKey = (key: string | undefined, defaultName?: string) =>
  key?.split("/").at(-1) || defaultName || "";
export default getNameFromKey;
