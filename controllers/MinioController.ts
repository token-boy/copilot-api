import { Controller, Payload, Post } from 'helpers/route.ts'
import { mc } from 'helpers/minio.ts'
import { PostPolicy } from 'minio'
import Input, { Field } from 'helpers/input.ts'
import { auth } from 'middlewares'

class BucketObjectName extends Input {
  @Field({ type: 'string', required: true })
  public bucketName!: string

  @Field({ type: 'string', required: true })
  public objectName!: string
}

@Controller('/v1/minio', auth)
class MinioController {
  constructor() {}

  @Post('/presigned_put_urls')
  @Payload(BucketObjectName)
  async presignedPutObject(payload: BucketObjectName) {
    const { bucketName, objectName } = payload
    const presignedPutUrl = await mc.presignedPutObject(bucketName, objectName)
    return { presignedPutUrl }
  }

  @Post('/presigned_post_policies')
  @Payload(BucketObjectName)
  async presignedPostPolicy(payload: BucketObjectName) {
    const { bucketName, objectName } = payload
    const postPolicy = new PostPolicy()
    postPolicy.setBucket(bucketName)
    postPolicy.setKey(objectName)
    postPolicy.setContentType('image/webp')
    postPolicy.setUserMetaData({ 'Server-Id': 'dfdlg' })
    return await mc.presignedPostPolicy(postPolicy)
  }
}

export default MinioController
