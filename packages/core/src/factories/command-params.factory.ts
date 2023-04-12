import { ParamData } from '@nestjs/common';
import { ParamsFactory } from '@nestjs/core';
import { Userstate } from 'tmi.js';
import { CommandParamTypes } from '../decorators';

export class CommandParamsFactory implements ParamsFactory {
  exchangeKeyForValue(
    type: CommandParamTypes,
    data: ParamData,
    [{ message }] : [{ channel: string; userstate: Userstate; message: string }],
  ) {
    const params = message.split(' ');

    switch (type) {
      case CommandParamTypes.PARAM:
        if (data) return typeof data === 'number' ? params[data] : null;
        return params;
      default:
        return null;
    }
  }
}
