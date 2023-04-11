import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { COMMAND_METADATA } from '../tmi.constants';

@Injectable()
export class CommandsExplorerService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  explore() {
    const controllers = this.discoveryService.getControllers();
    const commands = controllers.flatMap((wrapper) => this.getCommands(wrapper));

    return commands;
  }

  private getCommands(wrapper: InstanceWrapper) {
    const { instance } = wrapper;
    if (!instance) return [];

    const prototype = Object.getPrototypeOf(instance);
    const commands = this.metadataScanner
      .getAllMethodNames(prototype)
      .map((methodName) => {
        const callback = prototype[methodName];

        const metadata = Reflect.getMetadata(COMMAND_METADATA, callback);
        if (!metadata) return null;

        return { instance, methodName, metadata };
      })
      .filter((command) => !!command);

    return commands;
  }
}
