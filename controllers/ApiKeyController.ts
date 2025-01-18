import { Controller, Payload, Post } from 'helpers/route.ts'
import { ApiKey, Provider } from 'models'
import Input, { Field } from 'helpers/input.ts'
import { findByIdOrFail } from 'helpers/mongodb.ts'
import { auth } from "middlewares";

const tokens = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

class CreatePayload extends Input {
  @Field({ type: 'string', required: true })
  public providerId!: string
}

@Controller('/v1/api_keys', auth)
class ApiKeyController {
  constructor() {}

  @Post()
  @Payload(CreatePayload)
  async create({ providerId }: CreatePayload) {
    await findByIdOrFail(Provider, providerId)

    let key = 'ak-'
    for (let i = 0; i < 48; i++) {
      key = key + tokens[Math.floor(Math.random() * tokens.length)]
    }

    const apiKey = new ApiKey({ key, providerId })
    await apiKey.save()
    return apiKey
  }
}

export default ApiKeyController
