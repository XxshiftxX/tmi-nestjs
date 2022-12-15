export const ON_COMMAND_DECORATOR = '__ON_COMMAND_DECORATOR__';
export interface OnCommandDecoratorOptions {
  prefix: string;
  command: string;
}

export const OnCommand = (options: OnCommandDecoratorOptions): MethodDecorator => (
  (target: Record<string, any>, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ON_COMMAND_DECORATOR, options, target, propertyKey);

    return descriptor;
  }
);
