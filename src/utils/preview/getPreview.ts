import {
  GetObjectCommand,
  GetObjectCommandInput,
  _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import { s3 } from "../s3/s3";

interface PreviewUrlOptions {}

//TODO: Add preview urls for different formats in future
export default async function getPreview(
  key: string,
  previews: _Object[],
  options?: PreviewUrlOptions
) {
  const preview = previews.find((preview) => {
    const previewPath = path.parse(preview.Key || "");
    const filePath = path.parse(key);

    return (
      previewPath.name === filePath.name &&
      previewPath.dir.includes(filePath.dir)
    );
  });

  if (!preview) return null;

  const params: GetObjectCommandInput = {
    Bucket: process.env.S3_BUCKET,
    Key: preview.Key || "",
  };
  const url = await getSignedUrl(s3, new GetObjectCommand(params));

  return url;
}
