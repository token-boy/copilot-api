import { Client } from 'minio'

export const mc = new Client({
  endPoint: Deno.env.get('MINIO_ENDPOINT') as string,
  useSSL: true,
  accessKey: Deno.env.get('MINIO_ACCESS_KEY') as string,
  secretKey: Deno.env.get('MINIO_SECRET_KEY') as string,
})
