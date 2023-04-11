import { SetMetadata } from '@nestjs/common';
import { COMMAND_METADATA } from '../tmi.constants';

export interface CommandMetadata {
  name: string;
}

export const Command = (options: CommandMetadata): MethodDecorator => (
  (target: Object | Function, key?: string, descriptor?: any) => {
    SetMetadata(COMMAND_METADATA, options)(target, key, descriptor);
  }
);
