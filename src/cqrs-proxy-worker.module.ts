import { DynamicModule } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CqrsProxyWorkerController } from './controllers'

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
    }
  }
}
