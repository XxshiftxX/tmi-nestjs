export const COMMAND_PARAMETER_DECORATOR = '__COMMAND_PARAMETER_DECORATOR__';
export enum CommandParameterType {
  UserState,
  Message,
  Channel,
  Parameter,
  Rest,
}

export type CommandParameterOption = { index: number } & (
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

export const UserState = () => BuildCommandParameterDecorator(CommandParameterType.UserState);
export const Message = () => BuildCommandParameterDecorator(CommandParameterType.Message);
export const Channel = () => BuildCommandParameterDecorator(CommandParameterType.Channel);
export const Parameter = () => BuildCommandParameterDecorator(CommandParameterType.Parameter);
export const Rest = () => BuildCommandParameterDecorator(CommandParameterType.Rest);
