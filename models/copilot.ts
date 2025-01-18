import { Schema, model, SchemaTypes } from 'mongoose'

import { requiredObjectId, requiredString } from "helpers/validation.ts";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 32,
    index: true,
  },
  provider: {
    id: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    authfication: {
      apiKey: requiredString,
    },
  },
  type: {
    type: String,
    required: true,
    maxLength: 32,
    enum: ['chat', 'textToImage']
  },
  avatarUrl: requiredString,
  description: {
    type: String,
    required: true,
    maxLength: 300
  },
  serverId: requiredObjectId
})

const Copilot = model('Copilot', schema)

export default Copilot
