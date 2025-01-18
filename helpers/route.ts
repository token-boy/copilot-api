// deno-lint-ignore-file no-explicit-any ban-types

import { Reflect } from 'reflect-metadata'
import { validateInput } from "helpers/input.ts"

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export interface RouteDefinition {
  method: HttpMethod
  path: string
  propertyKey: string
  mws: Function[]
}

export interface JSONPatch {
  op: 'add' | 'remove' | 'replace' | 'copy' | 'move' | 'test'
  from?: string
  path: string
  value: any
}

export function Controller(prefix = '', ...gmws: Function[]) {
  return function (target: any) {
    Reflect.defineMetadata('prefix', prefix, target)
    Reflect.defineMetadata('gmws', gmws, target)
  }
}

export function Get(path = '', ...mws: Function[]) {
  return function (target: any, propertyKey: string) {
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target)
    }
    const routes = Reflect.getMetadata<RouteDefinition[]>('routes', target)
    routes.push({ method: HttpMethod.GET, path, propertyKey, mws })
  }
}

export function Post(path = '', ...mws: Function[]) {
  return function (target: any, propertyKey: string) {
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target)
    }

    const routes = Reflect.getMetadata<RouteDefinition[]>('routes', target)
    routes.push({ method: HttpMethod.POST, path, propertyKey, mws })
  }
}

export function Put(path = '', ...mws: Function[]) {
  return function (target: any, propertyKey: string) {
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target)
    }
    const routes = Reflect.getMetadata<RouteDefinition[]>('routes', target)
    routes.push({ method: HttpMethod.PUT, path, propertyKey, mws })
  }
}

export function Delete(path = '', ...mws: Function[]) {
  return function (target: any, propertyKey: string) {
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target)
    }
    const routes = Reflect.getMetadata<RouteDefinition[]>('routes', target)
    routes.push({ method: HttpMethod.DELETE, path, propertyKey, mws })
  }
}

export function Patch(path = '', ...mws: Function[]) {
  return function (target: any, propertyKey: string) {
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target)
    }
    const routes = Reflect.getMetadata<RouteDefinition[]>('routes', target)
    routes.push({ method: HttpMethod.PATCH, path, propertyKey, mws })
  }
}

export function Payload(Clazz: any) {
  return function (
    _target: Object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value
    descriptor.value = function (ctx: Ctx<any>) {
      const clazz = new Clazz()
      validateInput(clazz, ctx.payload)
      return method.apply(this, [clazz, ctx])
    }
  }
}

export function QueryParams(Clazz: any) {
  return function (
    _target: Object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value
    descriptor.value = function (ctx: Ctx) {
      const queryParams = Object.fromEntries(
        ctx.request.url.searchParams.entries()
      )
      const clazz = new Clazz()
      validateInput(clazz, queryParams)
      return method.apply(this, [clazz, ctx])
    }
  }
}
