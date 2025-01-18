import { Router } from 'oak'
import { Reflect } from 'reflect-metadata'
import { Status } from 'http'

import { HttpMethod, RouteDefinition } from 'helpers/route.ts'
import { parseBody } from 'middlewares'

import MinioController from './MinioController.ts'
import ServerController from './ServerController.ts'
import SessionController from './SessionController.ts'
// import AdminController from './AdminController.ts'
import ProviderController from './ProviderController.ts'
import CopliotController from './CopilotController.ts'
import ApiKeyController from "./ApiKeyController.ts";
import OpenAIController from './OpenAIController.ts'
import CommandController from './CommandController.ts'
import StableDiffusionController from './StableDiffusionController.ts'

// deno-lint-ignore no-explicit-any
const Controllers: any[] = [
  MinioController,
  ServerController,
  SessionController,
  // AdminController,
  CopliotController,
  ProviderController,
  OpenAIController,
  ApiKeyController,
  CommandController,
  StableDiffusionController,
]

function initRoutes(router: Router) {
  for (const Controller of Controllers) {
    const controller = new Controller()
    const prefix = Reflect.getMetadata<string>('prefix', Controller)
    const routes = Reflect.getMetadata<RouteDefinition[]>('routes', controller)
    // deno-lint-ignore ban-types
    const gmws = Reflect.getMetadata<Function[]>('gmws', Controller)

    for (const route of routes) {
      switch (route.method) {
        case HttpMethod.POST: {
          router.post(prefix + route.path, parseBody, async (ctx, next) => {
            console.info('\n=============================')
            console.info(`POST ${prefix}${route.path}`)
            try {
              for (const gmw of gmws) await gmw(ctx)
              for (const mw of route.mws) await mw(ctx)
              const data = await controller[route.propertyKey](ctx)
              ctx.response.body = data || {}
              ctx.response.status = Status.OK
            } catch (error) {
              ctx.response.status = error.status || 500
              ctx.response.body = {
                code: error.code || 500,
                message: error.message,
              }
              console.error(error)
            }
            next()
          })
          break
        }
        case HttpMethod.DELETE: {
          router.delete(prefix + route.path, async (ctx, next) => {
            console.info('\n=============================')
            console.info(`DELETE ${prefix}${route.path}`)
            console.info(ctx.params)
            try {
              for (const gmw of gmws) await gmw(ctx)
              for (const mw of route.mws) await mw(ctx)
              const data = await controller[route.propertyKey](ctx)
              ctx.response.status = 200
              ctx.response.body = data || {}
            } catch (error) {
              ctx.response.status = error.status || 500
              ctx.response.body = {
                code: error.code || 500,
                message: error.message,
              }
              console.error(error)
            }
            next()
          })
          break
        }
        case HttpMethod.PUT: {
          router.put(prefix + route.path, parseBody, async (ctx, next) => {
            console.info('\n=============================')
            console.info(`PUT ${prefix}${route.path}`)
            console.info(ctx.params)
            try {
              for (const gmw of gmws) await gmw(ctx)
              for (const mw of route.mws) await mw(ctx)
              const data = await controller[route.propertyKey](ctx)
              ctx.response.status = 200
              ctx.response.body = data || {}
            } catch (error) {
              ctx.response.status = error.status || 500
              ctx.response.body = {
                code: error.code || 500,
                message: error.message,
              }
              console.error(error)
            }
            next()
          })
          break
        }
        case HttpMethod.GET: {
          router.get(prefix + route.path, async (ctx, next) => {
            console.info('\n=============================')
            console.info(`GET ${prefix}${route.path}`)
            try {
              for (const gmw of gmws) await gmw(ctx)
              for (const mw of route.mws) await mw(ctx)
              const data = await controller[route.propertyKey](ctx)
              ctx.response.status = 200
              ctx.response.body = data || {}
            } catch (error) {
              ctx.response.status = error.status || 500
              ctx.response.body = {
                code: error.code || 500,
                message: error.message,
              }
              console.error(error)
            }
            next()
          })
          break
        }
        case HttpMethod.PATCH: {
          router.patch(prefix + route.path, parseBody, async (ctx, next) => {
            console.info('\n=============================')
            console.info(`PATCH ${prefix}${route.path}`)
            console.info(ctx.params || {})
            try {
              for (const gmw of gmws) await gmw(ctx)
              for (const mw of route.mws) await mw(ctx)
              const data = await controller[route.propertyKey](ctx)
              ctx.response.status = 200
              ctx.response.body = data || {}
            } catch (error) {
              ctx.response.status = error.status || 500
              ctx.response.body = {
                code: error.code || 500,
                message: error.message,
              }
              console.error(error)
            }
            next()
          })
          break
        }
      }
    }
  }
}

export default initRoutes
