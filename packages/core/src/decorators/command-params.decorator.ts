/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import { PipeTransform, Type } from '@nestjs/common';
import { COMMAND_PARAMETER_METADATA } from '../tmi.constants';

export enum CommandParamTypes {
  PARAM,
}

type ParamData = object | string | number;

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

Param();
