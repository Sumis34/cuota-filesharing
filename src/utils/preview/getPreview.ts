import axios from "axios";
import getImagePreviewUrl from "./getImagePreviewUrl";

interface PreviewUrlOptions {}

//TODO: Add preview urls for different formats in future
export default function getPreview(key: string, options?: PreviewUrlOptions) {
  const url = getImagePreviewUrl(`s3://${process.env.S3_BUCKET}/${key}`);
  return url;
}
