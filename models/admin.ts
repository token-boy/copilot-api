import { Schema, model } from 'mongoose'

import { requiredString } from 'helpers/validation.ts'

const schema = new Schema({
  account: requiredString,
  password: requiredString,
})

const Admin = model('Admin', schema)

export default Admin
