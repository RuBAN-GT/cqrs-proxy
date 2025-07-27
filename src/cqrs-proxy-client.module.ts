import { DynamicModule } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { CommandBus } from '@nestjs/cqrs'
import { ClientProxy } from '@nestjs/microservices'

import { CQRS_PROXY_ARGS_TOKEN, CqrsProxyAsyncModuleArgs, CqrsProxyModuleArgs } from './defs'
import { ProxyBus } from './services'

/**
 * High-level module helping to send commands to Worker.
 */
export class CqrsProxyClientModule {
  public static register(args: CqrsProxyModuleArgs): DynamicModule {
    const { clientToken, useSyncMode = false } = args
    return {
      module: CqrsProxyClientModule,
      global: true,
      exports: [ProxyBus, CQRS_PROXY_ARGS_TOKEN],
      providers: [
        { provide: CQRS_PROXY_ARGS_TOKEN, useValue: args },
        {
          provide: ProxyBus,
          inject: [clientToken, CommandBus],
          useFactory: (clientProxy: ClientProxy, commandBus: CommandBus): ProxyBus => {
            return useSyncMode ? (commandBus as unknown as ProxyBus) : new ProxyBus(clientProxy)
          },
        },
      ],
    }
  }

  public static registerAsync(args: CqrsProxyAsyncModuleArgs): DynamicModule {
    const { imports = [], inject = [], useFactory } = args

    return {
      module: CqrsProxyClientModule,
      global: true,
      imports,
      exports: [ProxyBus, CQRS_PROXY_ARGS_TOKEN],

      providers: [
        { provide: CQRS_PROXY_ARGS_TOKEN, useFactory, inject },
        {
          provide: ProxyBus,
          inject: [ModuleRef, CQRS_PROXY_ARGS_TOKEN, CommandBus],
          useFactory: (moduleRef: ModuleRef, args: CqrsProxyModuleArgs, commandBus: CommandBus): ProxyBus => {
            const { clientToken, useSyncMode = false } = args
            if (useSyncMode) {
              return commandBus as unknown as ProxyBus
            }
            return new ProxyBus(moduleRef.get<ClientProxy>(clientToken, { strict: false }))
          },
        },
      ],
    }
  }
}
