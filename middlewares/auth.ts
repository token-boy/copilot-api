import { verify, create } from 'djwt'

import { Http401, Http403 } from 'helpers/http.ts'
import {
  EXTRACTABLE,
  KEY_FORMAT,
  KEY_NAME,
  algorithm,
  keyUsages,
} from '../scripts/generate_key.ts'

const audience = ['xyz.zhiren.app']

const key = await crypto.subtle.importKey(
  KEY_FORMAT,
  Deno.readFileSync(KEY_NAME),
  algorithm,
  EXTRACTABLE,
  keyUsages
)

/**
 * Handling authentication.
 * @param ctx
 * @param next
 */
async function auth(ctx: Ctx) {
  const token = ctx.request.headers.get('Authorization') ?? ''
  const [type, accessToken] = token?.split(' ')

  try {
    if (type !== 'Bearer' || !accessToken) throw ctx
    const profile = (await verify(accessToken, key, {
      audience,
    })) as typeof ctx.profile
    ctx.profile = { uid: profile.uid, priv: profile.priv }
  } catch (error) {
    console.log(error)

    throw new Http401(401, 'unauthorized')
  }
}

export function requirePriv(priv: keyof Priv) {
  return function (ctx: Ctx) {
    if (!ctx.profile.priv[priv]) {
      throw new Http403(403, 'permission denied')
    }
  }
}

export function createAccessToken(uid: string) {
  const now = Date.now()

  return create(
    { alg: 'HS512' },
    {
      iss: 'zhiren.xyz',
      sub: uid,
      aud: audience,
      exp: now + 3600 * 24 * 7,
      iat: now,
    },
    key
  )
}

export default auth
