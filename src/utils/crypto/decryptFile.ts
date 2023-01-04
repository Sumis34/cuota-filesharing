async function streamToUint8Array(stream: ReadableStream<any>) {
  const reader = stream.getReader();
  const values = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return new Uint8Array(values);
    }
    values.push(...value);
  }
}

export default async function decryptFile(
  file: { name: string; type: string; content: ReadableStream<Uint8Array> },
  objectKey: string
) {
  const key = await window.crypto.subtle.importKey(
    "jwk",
    {
      k: objectKey,
      alg: "A128GCM",
      ext: true,
      key_ops: ["decrypt"],
      kty: "oct",
    },
    { name: "AES-GCM", length: 128 },
    false, // extractable
    ["decrypt"]
  );

  // Set up the decryption parameters

  const rawData = await streamToUint8Array(file.content);

  const iv = rawData.slice(0, 12);
  const content = rawData.slice(12);

  console.log(rawData);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    content
  );

  const decryptedFile = new File([decrypted], file.name, {
    type: file.type,
  });

  return decryptedFile;
}
