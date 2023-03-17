import { PipeTransform } from '@nestjs/common';
import { Client, Userstate } from 'tmi.js';
import { CommandParameterOption, CommandParameterType, COMMAND_PARAMETER_DECORATOR } from '../decorators/command-parameter.decorator';
import { OnCommandDecoratorOptions, ON_COMMAND_DECORATOR } from '../decorators/command.decorator';
import { Resolver } from './resolver';

type OnCommandHandler = Record<string, (...args: any[]) => any>

export class OnCommandResolver implements Resolver {
  resolve<T extends OnCommandHandler>(instance: T, methodName: string, client: Client) {
    const metadata: OnCommandDecoratorOptions = (
      Reflect.getMetadata(ON_COMMAND_DECORATOR, instance, methodName)
    );
    if (!metadata) return;

    const parameterOptions: CommandParameterOption[] = (
      Reflect.getMetadata(COMMAND_PARAMETER_DECORATOR, instance, methodName)
    ) ?? [];

    client.on('message', async (channel, userstate, message, self) => {
      if (self) return;
      if (!message.startsWith(metadata.prefix + metadata.command)) return;

      const values = this.getValueFromParameterOption(
        parameterOptions,
        channel,
        userstate,
        message,
      );
      const piped = await this.getPipedValueFromParameterOption(parameterOptions, values);

      const result = await instance[methodName](...piped);

      await client.say(channel, result);
    });
  }

  private getValueFromParameterOption(
    options: CommandParameterOption[],
    channel: string,
    userstate: Userstate,
    message: string,
  ) {
    const [, ...splitted] = message.split(' ');

    let parameterTargetIndex = 0;
    return options.map((option) => {
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
          const rest = splitted.slice(parameterTargetIndex).join(' ');
          parameterTargetIndex = null;
          return rest;

        default: return undefined;
      }
    });
  }

  private async getPipedValueFromParameterOption(options: CommandParameterOption[], values: any[]) {
    return Promise.all(values.map((value, index) => (
      options[index].pipes.reduce(
        // eslint-disable-next-line new-cap
        (value: any, pipe) => (typeof pipe === 'function' ? new pipe() : pipe).transform(value, { type: 'custom' }),
        value,
      )
    )));
  }
}
