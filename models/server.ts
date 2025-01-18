import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 32,
    index: true,
  },
  imageUrl: String,
})

const Server = model('Server', schema);

export default Server
