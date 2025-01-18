import { Schema, model } from 'mongoose'

import { requiredObjectId, requiredString } from 'helpers/validation.ts'

const schema = new Schema({
  copilotId: requiredObjectId,
  name: { ...requiredString, maxLength: 32 },
  template: { ...requiredString, maxLength: 1024 },
  variables: {
    type: [
      new Schema({
        name: { ...requiredString },
        reply: { ...requiredString, maxLength: 80 },
      }),
    ],
    default: [],
  },
  delimiter: { ...requiredString, maxLength: 8 },
})

const Command = model('Command', schema)

export default Command
