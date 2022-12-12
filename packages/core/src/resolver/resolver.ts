import { Client, Options } from 'tmi.js';

export interface Resolver {
  resolve(
    instance: Record<string, any>,
    methodName: string,
    client: Client,
    options?: Options,
  ): void;
}
