import { Events } from 'tmi.js';

export const ON_DECORATOR = '__ON_DECORATOR__';
export interface OnDecoratorOptions {
  events: keyof Events;
}

export const On = (options: OnDecoratorOptions): MethodDecorator => (
  (target: Record<string, any>, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ON_DECORATOR, options, target, propertyKey);

    return descriptor;
  }
);
