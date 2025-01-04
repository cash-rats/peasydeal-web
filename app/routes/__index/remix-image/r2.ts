import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { envs } from '~/utils/get_env_source';

let s3Client: S3Client | null | undefined = undefined;

if (envs.NODE_ENV === 'production' || envs.NODE_ENV === 'staging') {
  console.log('R2_ACCESS_KEY_ID', envs.R2_ACCESS_KEY_ID);
  console.log('R2_SECRET_ACCESS_KEY', envs.R2_SECRET_ACCESS_KEY);
  console.log('R2_ACCOUNT_ID', envs.R2_ACCOUNT_ID);
  console.log('R2_BUCKET_NAME', envs.R2_BUCKET_NAME);
  s3Client = new S3Client({
    credentials: {
      accessKeyId: envs.R2_ACCESS_KEY_ID,
      secretAccessKey: envs.R2_SECRET_ACCESS_KEY,
    },
  });
} else {
  /* Ignore r2 auth on development env */
}
interface IR2FileUploader {
  (params: { buffer: Buffer; filename: string }): Promise<boolean>;
}

const uploadToR2: IR2FileUploader = async ({ filename, buffer }) => {
  if (!s3Client) throw new Error('R2 client not initialized');

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: envs.R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: 'image/jpeg', // Adjust content type as needed
      })
    );
    return true;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

export { s3Client, uploadToR2 };
