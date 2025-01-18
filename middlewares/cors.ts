import { Context, Next } from 'oak'

// Allow cors origins.
const allowOrigins = JSON.parse(
  atob(Deno.env.get('ACCESS_CONTROL_LIST')!)
) as string[]

// Allow cors paths.
const allowPaths = ['']

async function cors(ctx: Context, next: Next) {
  const origin = ctx.request.headers.get('origin') ?? ''
  const path = ctx.request.url.pathname

  if (allowOrigins.indexOf(origin) !== -1 || allowPaths.indexOf(path) !== -1) {
    ctx.response.headers.set('Access-Control-Allow-Origin', origin)
    ctx.response.headers.set(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type'
    )
    ctx.response.headers.set(
      'Access-Control-Allow-Methods',
      'OPTIONS, POST, DELETE, PUT, DELETE, PATCH'
    )
    if (ctx.request.method === 'OPTIONS') {
      ctx.response.status = 200
    } else {
      await next()
    }
  } else {
    ctx.response.status = 403
  }
}

export default cors
