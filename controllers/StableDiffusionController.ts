import { Controller, Payload, Post } from 'helpers/route.ts'
import { auth } from 'middlewares'
import Command from '../models/command.ts'
import Input, {
  requiredObjectField,
  requiredStringField,
} from 'helpers/input.ts'
import { Http404, Http500 } from 'helpers/http.ts'
import { mc } from 'helpers/minio.ts'
import { PostPolicy } from 'minio'
import { PromptTemplate } from 'langchain'
import { MessageType } from 'helpers/constants.ts'

const VARIABLE_PATTERN = /{([^}]+)}/g

function extractVariables(template: string) {
  const matches = template.match(VARIABLE_PATTERN)
  if (matches == null) {
    return []
  }
  return matches.map((match) => match.slice(1, -1))
}

class GenerateInput extends Input {
  @requiredStringField
  public commandId!: string

  @requiredObjectField
  public variables!: object
}

@Controller('/v1/stable_diffusion', auth)
class StableDiffusionController {
  constructor() {}

  @Post('/generate')
  @Payload(GenerateInput)
  async generate(payload: GenerateInput) {
    const command = await Command.findById(payload.commandId)
    if (command == null) {
      throw new Http404('Command not found')
    }

    const { template } = command
    const prompt = new PromptTemplate({
      template: template,
      inputVariables: extractVariables(template),
    })

    const res = await fetch(
      `${Deno.env.get('STABLE_DIFFUSION_TRIGGER_URL')}/sdapi/v1/txt2img`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: await prompt.format(payload.variables),
        }),
      }
    )

    const data = await res.json()
    if (res.status !== 200) {
      console.log(data)
      throw new Http500('generate error')
    }
    const binaryString = atob(data.images[0])
    const buffer = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i)
    }

    const postPolicy = new PostPolicy()
    postPolicy.setBucket('app')
    postPolicy.setKey(
      `/system/${Math.random().toString(36).substring(2, 15)}.png`
    )
    postPolicy.setContentType('image/png')
    postPolicy.setUserMetaData({ 'Server-Id': 'dfdlg' })
    const { postURL, formData } = await mc.presignedPostPolicy(postPolicy)
    const postData = new FormData()
    for (const [key, value] of Object.entries(formData)) {
      postData.append(key, value)
    }
    postData.append('file', new Blob([buffer], { type: 'image/png' }))

    await fetch(postURL, { method: 'POST', body: postData })

    return {
      type: MessageType.image,
      value: `${postURL}${postData.get('key')}`,
    }
  }
}

export default StableDiffusionController
