// deno-lint-ignore-file no-explicit-any

import { Context, Next } from 'oak'

import { Http404, Http500 } from "helpers/http.ts";

export function Model(Clazz: any) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value
    descriptor.value = async function (ctx: Ctx) {
      const id = ctx.params.id
      try {
        const result = await Clazz.findById(id)
        if (!result) {
          throw new Http404('Resource does not exist.')
        }
        const args = [result, ctx]
        return method.apply(this, args)
      } catch (error) {
        if (error instanceof Http404) {
          throw error
        }
        throw new Http500(error.message)
      }
    }
  }
}

export function Request(Clazz: any) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value
    descriptor.value = function (ctx: Ctx) {
      const args = [new Clazz(ctx.request.body), ctx]
      return method.apply(this, args)
    }
  }
}

export function ModelRequest(ModelClass: any, RequestClass: any) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value
    descriptor.value = async function (ctx: Ctx) {
      const id = ctx.params.id
      try {
        const result = await ModelClass.findById(id)
        if (!result) {
          throw new Http404('Resource does not exist.')
        }
        const args = [result, new RequestClass(ctx.request.body), ctx]
        return method.apply(this, args)
      } catch (error) {
        if (error instanceof Http404) {
         throw error
        }
        throw new Http500(error.message)
      }
    }
  }
}

export async function parseBody(ctx: Context, next: Next) {
  try {
    Object.defineProperty(ctx, 'payload', {
      value: await ctx.request.body().value,
    })
    await next()
  } catch {
    throw new Http500('parse body failed')
  }
}
