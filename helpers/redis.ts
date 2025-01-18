import { createLazyClient } from 'redis'

export const redis = createLazyClient({
  hostname: Deno.env.get('REDIS_HOSTNAME') ?? '127.0.0.1',
  port: Deno.env.get('REDIS_PORT'),
  password: Deno.env.get('REDIS_PASSWORD'),
})
