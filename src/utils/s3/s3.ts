import { S3Client } from "@aws-sdk/client-s3";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   endpoint: process.env.AWS_ENDPOINT,
//   s3ForcePathStyle: true, // needed with minio?
//   signatureVersion: "v4",
// });

const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.AWS_ENDPOINT || "",
  forcePathStyle: true, // needed with minio?
});

export { s3 };
