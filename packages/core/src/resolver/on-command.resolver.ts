import { Client } from 'tmi.js';
import { CommandParameterOption, CommandParameterType, COMMAND_PARAMETER_DECORATOR } from '../decorators/command-parameter.decorator';
import { OnCommandDecoratorOptions, ON_COMMAND_DECORATOR } from '../decorators/command.decorator';
import { Resolver } from './resolver';

type OnCommandHandler = Record<string, (...args: any[]) => void>

export class OnCommandResolver implements Resolver {
  resolve<T extends OnCommandHandler>(instance: T, methodName: string, client: Client) {
    const metadata: OnCommandDecoratorOptions = (
      Reflect.getMetadata(ON_COMMAND_DECORATOR, instance, methodName)
    );
    if (!metadata) return;

    const parameterOptions: CommandParameterOption[] = (
      Reflect.getMetadata(COMMAND_PARAMETER_DECORATOR, instance, methodName)
    );

    client.on('message', (channel, userstate, message, self) => {
      if (self) return;
      if (!message.startsWith(metadata.prefix)) return;

      const [, ...splitted] = message.split(' ');

      let parameterTargetIndex = 0;
      const parameters = parameterOptions.map((option) => {
        switch (option.type) {
          case CommandParameterType.Channel: return channel;
          case CommandParameterType.UserState: return userstate;
          case CommandParameterType.Message: return message;
          case CommandParameterType.Parameter:
            if (parameterTargetIndex === null) throw new Error("Parameter can't be placed after rest");
            const parameter = splitted[parameterTargetIndex];
            parameterTargetIndex += 1;
            return parameter;
          case CommandParameterType.Rest:
            const rest = splitted.slice(parameterTargetIndex + 1).join(' ');
            parameterTargetIndex = null;
            return rest;

          default: return undefined;
        }
      });

      instance[methodName](...parameters);
    });
  }
}
