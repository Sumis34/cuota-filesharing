export default async function decryptFile(file: File, objectKey: string) {
  const encrypted = await file.arrayBuffer();

  console.log(objectKey);
  

  const key = await window.crypto.subtle.importKey(
    "jwk",
    {
      k: objectKey,
      alg: "A128GCM",
      ext: true,
      key_ops: ["encrypt", "decrypt"],
      kty: "oct",
    },
    { name: "AES-GCM", length: 128 },
    false, // extractable
    ["decrypt"]
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(12) },
    key,
    encrypted
  );

  const buf = Buffer.from(decrypted);

  return buf;
}
