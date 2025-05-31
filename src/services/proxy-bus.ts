import { firstValueFrom } from 'rxjs'

import { Injectable } from '@nestjs/common'
import { ICommand } from '@nestjs/cqrs'
import { ClientProxy } from '@nestjs/microservices'

import { CQRS_PROXY_MESSAGE_PATTERN, CqrsProxyMetadata } from '../defs'
import { cqrsProxyPayloadSerializer } from '../utils'

/**
 * Service helping to send commands to MQ.
 *
 * @returns {Promise<CqrsProxyMetadata | undefined>} - Returns metadata with uniq operation id of the command or undefined if command is not valid.
 */
@Injectable()
export class ProxyBus {
  constructor(protected readonly clientProxy: ClientProxy) {}

  public async execute(command: ICommand): Promise<CqrsProxyMetadata | undefined> {
    const data = cqrsProxyPayloadSerializer.serialize(command)
    if (!data.command) {
      return
    }

    const command$ = this.clientProxy.send(CQRS_PROXY_MESSAGE_PATTERN, data)
    await firstValueFrom(command$)

    return data.metadata
  }
}
