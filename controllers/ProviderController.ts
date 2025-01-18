import { Controller, Get } from 'helpers/route.ts'
import { Provider } from 'models'
import { auth } from "middlewares";

@Controller('/v1/providers', auth)
class ProviderController {
  constructor() {}

  @Get()
  query() {
    return Provider.find()
  }
}

export default ProviderController
