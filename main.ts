import { Application, Router } from 'oak'
import 'dotenv'

import { cors } from 'middlewares'
import initRoutes from 'controllers'
import initMongoDB from 'helpers/mongodb.ts'

const app = new Application()
const router = new Router()

await initMongoDB()

app.use(cors)

initRoutes(router)
app.use(router.routes())
app.use(router.allowedMethods())

const port = parseInt(Deno.env.get('PORT') ?? '80')

console.log(`App listen on ${port}`)

try {
  await app.listen({ port })
} catch (error) {
  console.error(error)
}
