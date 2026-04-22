const path = require("path");
const { randomUUID } = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const PUBLIC_BASE_URL = (
  process.env.R2_PUBLIC_BASE_URL || "https://pub-d41aad026bae47e7a72694d394026589.r2.dev"
).replace(/\/$/, "");
const REVIEW_IMAGE_PREFIX = (
  process.env.R2_REVIEW_IMAGE_PREFIX || "review-images"
).replace(/^\/+|\/+$/g, "");

let r2Client;

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function getR2Client() {
  if (r2Client) {
    return r2Client;
  }

  const accountId = getRequiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY");

  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return r2Client;
}

function buildReviewImageKey(originalname = "") {
  const extension = path.extname(originalname);

  return `${REVIEW_IMAGE_PREFIX}/${Date.now()}-${randomUUID()}${extension}`;
}

async function uploadReviewImage(file) {
  if (!file?.buffer) {
    throw new Error("Review image buffer is missing");
  }

  const bucketName = getRequiredEnv("R2_BUCKET_NAME");
  const key = buildReviewImageKey(file.originalname);

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
    }),
  );

  return `${PUBLIC_BASE_URL}/${key}`;
}

module.exports = {
  uploadReviewImage,
};
