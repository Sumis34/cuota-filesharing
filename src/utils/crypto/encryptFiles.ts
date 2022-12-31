import FileSaver from "file-saver";
import JSZip from "jszip";
import { getRandomLetter } from "../greece";
import decryptFile from "./decryptFile";

const zipFiles = async (files: File[]) => {
  const zip = JSZip();
  files.forEach((file) => {
    zip.file(file.name, file);
  });
  const zipFile = await zip.generateAsync({ type: "blob" });
  return zipFile;
};

const encryptFile = async (
  file: Blob,
  key: CryptoKey
): Promise<{ key: CryptoKey; buffer: Buffer }> => {
  const fileBuffer = await file.arrayBuffer();

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: crypto.getRandomValues(new Uint8Array(12)) /* don't reuse key! */,
    },
    key,
    fileBuffer
  );

  const buf = Buffer.from(encrypted);

  return { key, buffer: buf };
};

/**
 *
 * @param files Array of files to encrypt
 * @param name Name of the resulting zip file
 * @returns encrypted files
 */
export default async function encryptFiles(files: File[], name?: string) {
  const encrypted: File[] = [];

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"]
  );

  // const zipFile = await zipFiles(files);

  for (const file of files) {
    const { buffer } = await encryptFile(file, key);

    encrypted.push(
      new File([buffer], file.name, {
        type: file.type,
      })
    );
  }

  console.log(await crypto.subtle.exportKey("jwk", key));

  

  // const encryptedFile = new File([encrypted.buffer], name, {
  //   type: "application/octet-stream",
  // });

  //Testing

  //   const decryptedBuf = await decryptFile(
  //     encryptedFile,
  //     (
  //       await crypto.subtle.exportKey("jwk", encrypted.key)
  //     ).k as string
  //   );

  // FileSaver.saveAs(
  //   new File([decryptedBuf], "name2.zip", {
  //     type: "application/octet-stream",
  //   })
  // );

  return encrypted;
}
