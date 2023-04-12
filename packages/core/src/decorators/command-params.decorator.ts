/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */

import { ParamData, PipeTransform, Type } from '@nestjs/common';
import { ChatUserstate } from 'tmi.js';
import { COMMAND_PARAMETER_METADATA } from '../tmi.constants';

type KnownKeys<T> = {
  [ P in keyof T as string extends P ? never : number extends P ? never : P ] : T[P]
};

export enum CommandParamTypes {
  PARAM,
  MESSAGE,
  USERSTATE,
  CHANNEL,
}

export interface CommandParamMetadata {
  index: number;
  data?: ParamData;
  paramtype: CommandParamTypes;
}

const assignMetadata = <TParamtype = any, TArgs = any>(
  args: TArgs,
  paramtype: TParamtype,
  index: number,
  data?: ParamData,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) => ({
    ...args,
    [`${paramtype}:${index}`]: { index, data, pipes, paramtype },
  });

const createCommandParamDecorator =
  (paramtype: CommandParamTypes) =>
    (data?: any): ParameterDecorator =>
      (target, key, index) => {
        const existing = (
          Reflect.getMetadata(COMMAND_PARAMETER_METADATA, target.constructor, key)
        );
        const args = assignMetadata<CommandParamTypes, Record<number, CommandParamMetadata>>(
          existing || {},
          paramtype,
          index,
          data,
        );

        Reflect.defineMetadata(
          COMMAND_PARAMETER_METADATA,
          args,
          target.constructor,
          key,
        );
      };

export function Param(): ParameterDecorator;
export function Param(position: number): ParameterDecorator;
export function Param(position?: number) {
  return createCommandParamDecorator(CommandParamTypes.PARAM)(position);
}

export function Message() {
  return createCommandParamDecorator(CommandParamTypes.MESSAGE)();
}

export function Userstate(): ParameterDecorator;
export function Userstate(key: keyof KnownKeys<ChatUserstate>): ParameterDecorator;
export function Userstate(key: string): ParameterDecorator;
export function Userstate(key?: string) {
  return createCommandParamDecorator(CommandParamTypes.USERSTATE)(key);
}

export function Channel() {
  return createCommandParamDecorator(CommandParamTypes.CHANNEL)();
}
