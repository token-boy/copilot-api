import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  QueryParams,
} from 'helpers/route.ts'
import { Command } from 'models'
import Input, { requiredStringField } from 'helpers/input.ts'
import { auth } from "middlewares";

class QueryInput extends Input {
  @requiredStringField
  public copilotId!: string
}

@Controller('/v1/commands', auth)
class CommandController {
  constructor() {}

  @Post('')
  async create(ctx: Ctx) {
    const command = new Command(ctx.payload)
    await command.save()
    return command
  }

  @Delete('/:id')
  delete(ctx: Ctx) {
    return Command.findByIdAndDelete(ctx.params.id)
  }

  @Put('/:id')
  update(ctx: Ctx) {
    return Command.findByIdAndUpdate(ctx.params.id, ctx.payload)
  }

  @Get('')
  @QueryParams(QueryInput)
  query(queryParams: QueryInput) {
    return Command.find(queryParams)
  }
}

export default CommandController
