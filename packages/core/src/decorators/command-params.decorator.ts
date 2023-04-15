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
    (data?: any, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator =>
      (target, key, index) => {
        const existing = (
          Reflect.getMetadata(COMMAND_PARAMETER_METADATA, target.constructor, key)
        );
        const args = assignMetadata<CommandParamTypes, Record<number, CommandParamMetadata>>(
          existing || {},
          paramtype,
          index,
          data,
          ...pipes,
        );

        Reflect.defineMetadata(
          COMMAND_PARAMETER_METADATA,
          args,
          target.constructor,
          key,
        );
      };

export function Param(): ParameterDecorator;
export function Param(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Param(position: number): ParameterDecorator;
export function Param(
  position: number,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export function Param(
  positionOrPipe?: number | (Type<PipeTransform> | PipeTransform),
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) {
  if (positionOrPipe === undefined) {
    return createCommandParamDecorator(CommandParamTypes.PARAM)();
  }
  if (typeof positionOrPipe === 'number') {
    return createCommandParamDecorator(CommandParamTypes.PARAM)(positionOrPipe, ...pipes);
  }

  return createCommandParamDecorator(CommandParamTypes.PARAM)(positionOrPipe, ...pipes);
}

export function Message();
export function Message(...pipes: (Type<PipeTransform> | PipeTransform)[]);
export function Message(...pipes: (Type<PipeTransform> | PipeTransform)[]) {
  return createCommandParamDecorator(CommandParamTypes.MESSAGE)(null, ...pipes);
}

export function Userstate(): ParameterDecorator;
export function Userstate(key: keyof KnownKeys<ChatUserstate>): ParameterDecorator;
export function Userstate(
  key: keyof KnownKeys<ChatUserstate>,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export function Userstate(key: string): ParameterDecorator;
export function Userstate(
  key: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export function Userstate(keyOrPipe?: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]) {
  if (keyOrPipe === undefined) {
    return createCommandParamDecorator(CommandParamTypes.USERSTATE)();
  }
  if (typeof keyOrPipe === 'string') {
    return createCommandParamDecorator(CommandParamTypes.USERSTATE)(keyOrPipe, ...pipes);
  }
  return createCommandParamDecorator(CommandParamTypes.USERSTATE)(keyOrPipe, ...pipes);
}

export function Channel(): ParameterDecorator;
export function Channel(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export function Channel(...pipes: (Type<PipeTransform> | PipeTransform)[]) {
  return createCommandParamDecorator(CommandParamTypes.CHANNEL)(null, ...pipes);
}
