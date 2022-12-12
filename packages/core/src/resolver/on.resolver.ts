import { Client, Events } from 'tmi.js';
import { OnDecoratorOptions, ON_DECORATOR } from '../decorators/on.decorator';
import { Resolver } from './resolver';

type OnHandler = Record<string, (...args: Parameters<Events[keyof Events]>) => void>
export class OnResolver implements Resolver {
  resolve<T extends OnHandler>(instance: T, methodName: string, client: Client) {
    const metadata: OnDecoratorOptions = Reflect.getMetadata(ON_DECORATOR, instance, methodName);
    if (!metadata) return;

    client.on(metadata.events, (...args: Parameters<Events[keyof Events]>) => {
      instance[methodName](...args);
    });
  }
}
