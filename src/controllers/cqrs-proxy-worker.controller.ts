import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { MessagePattern } from '@nestjs/microservices'

import type { CqrsProxyData } from '../defs'
import { CQRS_PROXY_MESSAGE_PATTERN } from '../defs'
import { cqrsProxyCommandsLocator } from '../utils'

/**
 * MQ Listener helping to gather commands and execute them.
 */
@Controller()
export class CqrsProxyWorkerController {
  constructor(protected readonly commandBus: CommandBus) {}

  @MessagePattern(CQRS_PROXY_MESSAGE_PATTERN)
  public async handleCommand(request: CqrsProxyData): Promise<any> {
    if (!request.command) {
      throw new Error('Command name is required.')
    }

    const result = cqrsProxyCommandsLocator.allocate(request)
    await this.commandBus.execute(result)

    return true
  }
}
