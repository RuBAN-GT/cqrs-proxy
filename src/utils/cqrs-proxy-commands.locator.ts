import { plainToInstance } from 'class-transformer'

import { CqrsProxyData } from '../defs'

/**
 * Custom locator helping to register and allocate commands like original CQRS.
 */
export class CqrsProxyCommandsLocator {
  protected readonly commands: Map<string, any> = new Map()

  public register(name: string, target: any): void {
    this.commands.set(name, target)
  }

  public allocate(data: CqrsProxyData): any {
    const { command, payload, metadata } = data

    const target = this.commands.get(command)
    if (!target) {
      throw new Error(`Command ${command} not found`)
    }
    return plainToInstance(target, { ...payload, metadata })
  }
}

export const cqrsProxyCommandsLocator = new CqrsProxyCommandsLocator()
