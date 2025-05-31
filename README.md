# Nest.js CQRS Proxy Bus

[![npm version](https://badge.fury.io/js/cqrs-proxy.svg)](https://badge.fury.io/js/cqrs-proxy)

The package provides a CQRS Proxy Bus for Nest.js applications. It allows you to create a proxy bus that can be used to send commands to different handlers by `@nestjs/microservices` workflow and handle them by workers.

## Useful Links

- [Nest.js Microservices](https://docs.nestjs.com/microservices/basics)
- [Nest.js CQRS](https://docs.nestjs.com/cqrs)

## Installation

You can install it using yarn or any other package manager:

```bash
yarn add cqrs-proxy
```

Don't forget to setup peer dependencies:

```bash
yarn add @nestjs/cqrs @nestjs/schematics @nestjs/common @nestjs/core @nestjs/microservices rxjs uuid class-transformer
```

## Usage

### Importing the Module

To use the CQRS Proxy Bus, you need to import the `CqrsProxyClientModule` into your Nest.js module as client:

```typescript
import { CqrsProxyClientModule } from 'cqrs-proxy'

@Module({
  imports: [
    CqrsProxyClientModule.register({
      clientToken: 'AMQP_CLIENT', // The name of the microservice
    }),
  ],
})
export class MyModule {}
```

### Sending Commands

You can send commands using the `ProxyBus` service. Here's an example of how to send a command:

```typescript
import { Injectable } from '@nestjs/common'
import { ICommand } from '@nestjs/cqrs'

import { ProxyBus } from 'cqrs-proxy'

class MyCommand implements ICommand {
  constructor(public readonly data: string) {}
}

@Injectable()
export class MyService {
  constructor(private readonly proxyBus: ProxyBus) {}

  public async run(): Promise<void> {
    const command = new MyCommand('Hello, World!')
    await this.proxyBus.send(command) // returns metadata with id
  }
}
```

### Handling Commands

All magic happens in the worker. You need to import `CqrsProxyWorkerModule` into your root module and create a handler for your command and register it in the worker module using default `CqrsModule` and command handler matching to `MyCommand` from example above:

```typescript
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CqrsProxyWorkerModule } from 'cqrs-proxy'

import { MyCommandHandler } from './my-command.handler'
import { MyCommand } from './my-command.command'
import { MyService } from './my.service'

@CommandHandler(MyCommand)
export class MyCommandHandler implements ICommandHandler<MyCommand> {
  public async execute(command: MyCommand): Promise<void> {
    console.log('Handling command:', command.data) // Handling command: Hello, World!
  }
}

@Module({
  imports: [CqrsModule, CqrsProxyWorkerModule.forRoot()],
  providers: [MyService, MyCommandHandler],
})
export class MyWorkerModule {}
```
