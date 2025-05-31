import { CQRS_PROXY_COMMAND_NAME } from '../defs'
import { cqrsProxyCommandsLocator } from '../utils'

/**
 * Simple command register.
 */
export function ProxyCommand(name?: string): ClassDecorator {
  return function (target: any): void {
    const commandName = name ?? target?.name
    target[CQRS_PROXY_COMMAND_NAME] = commandName

    cqrsProxyCommandsLocator.register(commandName, target)
  }
}
