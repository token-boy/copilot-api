import { Controller, Payload, Post } from 'helpers/route.ts'
import { LLMChain, OpenAI, PromptTemplate } from 'langchain'
import { auth } from 'middlewares'
import Command from '../models/command.ts'
import Input, {
  requiredObjectField,
  requiredStringField,
} from 'helpers/input.ts'
import { Http404 } from 'helpers/http.ts'
import { MessageType } from 'helpers/constants.ts'

const model = new OpenAI({
  openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
  temperature: 0.9,
})

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

@Controller('/v1/openai', auth)
class OpenAIController {
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

    const chain = new LLMChain({ llm: model, prompt: prompt })
    
    const {text} = await chain.call(payload.variables)

    return {
      type: MessageType.text,
      value: text.trim()
    }
  }
}

export default OpenAIController
