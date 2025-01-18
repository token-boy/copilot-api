import { Controller, Payload, Post } from 'helpers/route.ts'
import Input, { Field } from 'helpers/input.ts'
import { Http400 } from "helpers/http.ts"
import Admin from '../models/admin.ts'
import { createAccessToken } from '../middlewares/auth.ts'

class CreatePayload extends Input {
  @Field({ type: 'string', required: true })
  public account!: string

  @Field({ type: 'string', required: true })
  public password!: string
}

@Controller('/v1/sessions')
class SessionController {
  constructor() {}

  @Post()
  @Payload(CreatePayload)
  async create(payload: CreatePayload) {
    const admin = await Admin.findOne({ account: payload.account })

    const uint8Array = new TextEncoder().encode(payload.password)
    const hashBuffer = await crypto.subtle.digest('SHA-512', uint8Array)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    if (!admin || admin.password != hashHex) {
      throw new Http400(400001, 'account or password incorrect')
    }

    const accessToken = await createAccessToken(admin!.id)
    return { accessToken }
  }
}

export default SessionController
