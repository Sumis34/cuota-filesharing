const encryptFile = async (
  file: Blob,
  key: CryptoKey
): Promise<{ key: CryptoKey; buffer: Buffer; array: Uint8Array }> => {
  const fileBuffer = await file.arrayBuffer();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv /* don't reuse key! */,
    },
    key,
    fileBuffer
  );

  const secData = new Uint8Array(iv.byteLength + encrypted.byteLength);
  secData.set(iv, 0);
  secData.set(new Uint8Array(encrypted), iv.byteLength);

  const buf = Buffer.from(secData);

  console.log("Iv:", secData.slice(0, 12));

  return { key, buffer: buf, array: secData };
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
    { name: "AES-GCM", length: 128 },
    true, // extractable
    ["encrypt", "decrypt"]
  );

  // const zipFile = await zipFiles(files);
  for (const file of files) {
    const { buffer, array } = await encryptFile(file, key);

    encrypted.push(
      new File([array], file.name, {
        type: file.type,
      })
    );
  }

  const jwk = await crypto.subtle.exportKey("jwk", key);

  return { files: encrypted, key: jwk.k };
}
