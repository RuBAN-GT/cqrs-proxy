import { v4 } from 'uuid'

import { ICommand } from '@nestjs/cqrs'

import { CQRS_PROXY_COMMAND_NAME, CqrsProxyData } from '../defs'

/**
 * Serializer helping to serialize command & payload for MQ.
 */
export class CqrsProxyPayloadSerializer {
  public serialize(command: ICommand): CqrsProxyData {
    const commandName = (command as any)?.constructor?.[CQRS_PROXY_COMMAND_NAME]

    return {
      metadata: { id: v4() },
      command: commandName,
      payload: command,
    }
  }
}

export const cqrsProxyPayloadSerializer = new CqrsProxyPayloadSerializer()
