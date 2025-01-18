import { Schema, model } from 'mongoose'

import { requiredObjectId, requiredString } from 'helpers/validation.ts'

const schema = new Schema({
  key: requiredString,
  providerId: requiredObjectId,
})

const ApiKey = model('ApiKey', schema)

export default ApiKey
