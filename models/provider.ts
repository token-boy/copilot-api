import { Schema, model } from 'mongoose'
import { requiredString } from "helpers/validation.ts"

const schema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 32,
    index: true,
    unique: true,
  },
  status: {
    // online offline
    type: String,
    default: 'online',
  },
  imageUrl: requiredString,
  summary: {
    type: String,
    required: true,
    maxLength: 300
  }
})

const Provider = model('Provider', schema)


export default Provider
