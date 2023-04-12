import { Injectable } from '@nestjs/common';
import { ExternalContextCreator, MetadataScanner, ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { CommandMetadata } from '../decorators/command.decorator';
import { CommandParamsFactory } from '../factories/command-params.factory';
import { COMMAND_METADATA, COMMAND_PARAMETER_METADATA } from '../tmi.constants';

export type CommandType = {
  methodName: string;
  metadata: CommandMetadata;
};

@Injectable()
export class CommandsExplorerService {
  private readonly commandParamsFactory = new CommandParamsFactory();

  constructor(
    private readonly metadataScanner: MetadataScanner,
    private readonly externalContextCreator: ExternalContextCreator,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  explore() {
    const modules = [...this.modulesContainer.values()];
    const commands = modules.flatMap((moduleRef) => {
      const providers = [...moduleRef.providers.values()];
      return providers.map((wrapper) => this.filterCommands(wrapper)).flat();
    });

    return commands;
  }

  private filterCommands(wrapper: InstanceWrapper) {
    const { instance } = wrapper;
    if (!instance) return [];
    const prototype = Object.getPrototypeOf(instance);

    const commands = this.metadataScanner
      .getAllMethodNames(prototype)
      .map((methodName): CommandType | null => {
        const callback = prototype[methodName];
        const metadata = Reflect.getMetadata(COMMAND_METADATA, callback) as CommandMetadata;
        if (!metadata) return null;

        return { methodName, metadata };
      })
      .filter((command) => !!command);

    return commands.map((command) => {
      const createContext = () => this.createContextCallback(instance, prototype, command);

      return { ...command, callback: createContext() };
    });
  }

  private createContextCallback<T extends Record<string, any>>(
    instance: T,
    prototype: any,
    command: CommandType,
  ) {
    const commandCallback = this.externalContextCreator.create(
      instance,
      prototype[command.methodName],
      command.methodName,
      COMMAND_PARAMETER_METADATA,
      this.commandParamsFactory,
      undefined,
      undefined,
      undefined,
      'tmi',
    );

    return commandCallback;
  }
}
