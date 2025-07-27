import { DynamicModule } from '@nestjs/common'
import { CommandBus, CqrsModule } from '@nestjs/cqrs'

import { CqrsProxyWorkerController } from './controllers'
import { ProxyBus } from './services'

/**
 * High-level module helping to execute incoming commands from MQ.
 */
export class CqrsProxyWorkerModule {
  public static forRoot(): DynamicModule {
    return {
      module: CqrsProxyWorkerModule,
      global: true,
      imports: [CqrsModule.forRoot()],
      controllers: [CqrsProxyWorkerController],
      providers: [{ provide: ProxyBus, useClass: CommandBus }],
      exports: [ProxyBus],
    }
  }
}
