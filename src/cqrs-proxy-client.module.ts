import { DynamicModule } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { CQRS_PROXY_ARGS_TOKEN, CqrsProxyModuleArgs } from './defs'
import { ProxyBus } from './services'

/**
 * High-level module helping to send commands to Worker.
 */
export class CqrsProxyClientModule {
  public static register(args: CqrsProxyModuleArgs): DynamicModule {
    const { clientToken } = args
    return {
      module: CqrsProxyClientModule,
      global: true,
      exports: [ProxyBus, CQRS_PROXY_ARGS_TOKEN],
      providers: [
        { provide: CQRS_PROXY_ARGS_TOKEN, useValue: args },
        {
          provide: ProxyBus,
          inject: [clientToken],
          useFactory: (clientProxy: ClientProxy): ProxyBus => new ProxyBus(clientProxy),
        },
      ],
    }
  }
}
