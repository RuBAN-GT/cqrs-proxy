import { DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency, Type } from '@nestjs/common'

import { CqrsProxyModuleArgs } from './cqrs-proxy-module.args'

export interface CqrsProxyAsyncModuleArgs {
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
  inject?: Array<InjectionToken | OptionalFactoryDependency>
  useFactory: (...args: any[]) => Promise<CqrsProxyModuleArgs> | CqrsProxyModuleArgs
}
