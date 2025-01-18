import { Controller, Payload, Post } from 'helpers/route.ts'
import Input, { Field } from 'helpers/input.ts'
import Admin from '../models/admin.ts'

class CreatePayload extends Input {
  @Field({ type: 'string', required: true })
  public account!: string

  @Field({ type: 'string', required: true })
  public password!: string
}

@Controller('/v1/admins')
class AdminController {
  constructor() {}

  @Post()
  @Payload(CreatePayload)
  async create(payload: CreatePayload) {
    const uint8Array = new TextEncoder().encode(payload.password)
    const hashBuffer = await crypto.subtle.digest('SHA-512', uint8Array)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    const admin = new Admin({
      account: payload.account,
      password: hashHex
    })  
    await admin.save()

    return admin
  }
}

export default AdminController
