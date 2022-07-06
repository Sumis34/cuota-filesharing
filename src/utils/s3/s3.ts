import { S3Client } from "@aws-sdk/client-s3";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   endpoint: process.env.S3_ENDPOINT,
//   s3ForcePathStyle: true, // needed with minio?
//   signatureVersion: "v4",
// });

const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.S3_ENDPOINT || "",
  forcePathStyle: true, // needed with minio?
});

export { s3 };
