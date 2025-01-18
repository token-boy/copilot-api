import { Controller, Get, Post, Put } from 'helpers/route.ts'
import { Server } from 'models'
import { auth } from 'middlewares'

@Controller('/v1/servers', auth)
class ServerController {
  constructor() {}

  @Post()
  async create(ctx: Ctx) {
    const server = new Server(ctx.payload)
    await server.save()
    return server
  }

  @Put('/:id')
  update(ctx: Ctx) {
    return Server.findByIdAndUpdate(ctx.params.id, ctx.payload)
  }

  @Get()
  async query() {
    const servers = await Server.find()
    return servers
  }
}

export default ServerController
