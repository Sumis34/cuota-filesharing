import Imgproxy from "imgproxy";

export default function getImagePreviewUrl(url: string) {
  const imgproxy = new Imgproxy({
    baseUrl: process.env.IMGPROXY_ENDPOINT || "",
    key: process.env.IMGPROXY_KEY || "",
    salt: process.env.IMGPROXY_SALT || "",
    encode: true,
  });

  return imgproxy.builder().resize("fit", 300).format("webp").generateUrl(url);
}
