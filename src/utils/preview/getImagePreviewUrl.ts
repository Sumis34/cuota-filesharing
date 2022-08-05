import Imgproxy from "imgproxy";
/**
 * 
 * @param url The url of the image to be previewed `s3://${process.env.S3_BUCKET}/${key}`
 * @returns url to the the preview image
 */
export default function getImagePreviewUrl(url: string) {
  const imgproxy = new Imgproxy({
    baseUrl: process.env.IMGPROXY_ENDPOINT || "",
    key: process.env.IMGPROXY_KEY || "",
    salt: process.env.IMGPROXY_SALT || "",
    encode: true,
  });

  return imgproxy.builder().resize("fit", 300).format("webp").generateUrl(url);
}
