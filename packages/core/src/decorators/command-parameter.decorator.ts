import { PipeTransform } from '@nestjs/common';

export const COMMAND_PARAMETER_DECORATOR = '__COMMAND_PARAMETER_DECORATOR__';
export enum CommandParameterType {
  UserState,
  Message,
  Channel,
  Parameter,
  Rest,
}

export type CommandParameterOption = { index: number; pipes: PipeTransform[] } & (
  { type: CommandParameterType.UserState } |
  { type: CommandParameterType.Message } |
  { type: CommandParameterType.Channel } |
  { type: CommandParameterType.Parameter } |
  { type: CommandParameterType.Rest }
)

export const BuildCommandParameterDecorator = (
  (type: CommandParameterType, options: Record<string, any> = {}): ParameterDecorator => (
    (target: Record<string, any>, propertyKey: string | symbol, index: number) => {
      const params = Reflect.getMetadata(COMMAND_PARAMETER_DECORATOR, target, propertyKey) ?? [];
      params[index] = { index, type, ...options };

      Reflect.defineMetadata(
        COMMAND_PARAMETER_DECORATOR,
        params,
        target,
        propertyKey,
      );
    }
  )
);

export const UserState = (...pipes: PipeTransform[]) => (
  BuildCommandParameterDecorator(CommandParameterType.UserState, { pipes })
);
export const Message = (...pipes: PipeTransform[]) => (
  BuildCommandParameterDecorator(CommandParameterType.Message, { pipes })
);
export const Channel = (...pipes: PipeTransform[]) => (
  BuildCommandParameterDecorator(CommandParameterType.Channel, { pipes })
);
export const Parameter = (...pipes: PipeTransform[]) => (
  BuildCommandParameterDecorator(CommandParameterType.Parameter, { pipes })
);
export const Rest = (...pipes: PipeTransform[]) => (
  BuildCommandParameterDecorator(CommandParameterType.Rest, { pipes })
);
