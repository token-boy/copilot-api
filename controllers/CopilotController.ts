import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  QueryParams,
} from 'helpers/route.ts'
import { Command, Copilot } from 'models'
import { auth } from 'middlewares'
import Input, { requiredStringField } from 'helpers/input.ts'

class QueryInput extends Input {
  @requiredStringField
  public serverId!: string
}

class QueryCommandsInput extends Input {
  @requiredStringField
  public copilotId!: string
}

@Controller('/v1/copilots', auth)
class CopliotController {
  constructor() {}

  @Post()
  create(ctx: Ctx) {
    return new Copilot(ctx.payload).save()
  }

  @Delete('/:id')
  delete(ctx: Ctx) {
    return Copilot.findByIdAndDelete(ctx.params.id)
  }

  @Put('/:id')
  update(ctx: Ctx) {
    return Copilot.findByIdAndUpdate(ctx.params.id, ctx.payload)
  }

  @Get()
  @QueryParams(QueryInput)
  query(queryParams: QueryInput) {
    return Copilot.find(queryParams)
  }

  @Get('/:id')
  queryOne(ctx: Ctx) {
    return Copilot.findById(ctx.params.id)
  }

  @Get('/:id/commands')
  @QueryParams(QueryCommandsInput)
  queryCommands(queryParams: QueryCommandsInput) {
    return Command.find(queryParams)
  }
}

export default CopliotController
