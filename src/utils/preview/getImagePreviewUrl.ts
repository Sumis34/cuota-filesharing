import { createHmac } from "crypto";
//import pb from "@bitpatty/imgproxy-url-builder";

const urlSafeBase64 = (string: string) => {
  return Buffer.from(string)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const hexDecode = (hex: string) => Buffer.from(hex, "hex");

const sign = (salt: string, target: string, secret: string) => {
  const hmac = createHmac("sha256", hexDecode(secret));
  hmac.update(hexDecode(salt));
  hmac.update(target);
  return hmac
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export default function getImagePreviewUrl(url: string) {
  const resizing_type = "fill";
  const width = 300;
  const height = 300;
  const gravity = "no";
  const enlarge = 1;
  const extension = "avif";
  const encoded_url = urlSafeBase64(url);
  const path = `/rs:${resizing_type}:${width}:${height}:${enlarge}/g:${gravity}/${encoded_url}.${extension}`;

  const signature = sign(
    process.env.IMGPROXY_SALT || "",
    path,
    process.env.IMGPROXY_KEY || ""
  );

  return `${process.env.IMGPROXY_ENDPOINT}/${signature}${path}`;
}
