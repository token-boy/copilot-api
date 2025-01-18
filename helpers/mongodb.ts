import { connect, SchemaTypes, Model } from "mongoose";
import { Http404 } from "helpers/http.ts"

async function initMongoDB() {
  console.log('connecting to mongodb...')

  await connect(Deno.env.get('MONGODB_URI') as string)

  SchemaTypes.String.cast(false)
  SchemaTypes.Number.cast(false)
  SchemaTypes.Boolean.cast(false)

  console.log('connected to mongodb')
}

export async function findByIdOrFail<T>(model: Model<T>, id: string) {
  const document = await model.findById(id)
  
  if (!document) {
    throw new Http404(`${model.modelName} not found`)
  }
  return document
}

export default initMongoDB
