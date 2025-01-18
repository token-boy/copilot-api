import { SchemaTypes } from 'mongoose'

export const requiredString = {
  type: String,
  required: true,
}

export const requiredObjectId = {
  type: SchemaTypes.ObjectId,
  required: true,
}
