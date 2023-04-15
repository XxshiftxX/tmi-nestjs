import { ParamData } from '@nestjs/common';
import { ParamsFactory } from '@nestjs/core';
import { ChatUserstate } from 'tmi.js';
import { CommandParamTypes } from '../decorators';

export class CommandParamsFactory implements ParamsFactory {
  exchangeKeyForValue(
    type: CommandParamTypes,
    data: ParamData,
    [channel, userstate, message] : [channel: string, userstate: ChatUserstate, message: string],
  ) {
    const params = message.split(' ');

    switch (type) {
      case CommandParamTypes.PARAM:
        if (data) return typeof data === 'number' ? params[data] : null;
        return params;
      case CommandParamTypes.MESSAGE:
        if (data) return typeof data === 'number' ? params.slice(data).join(' ') : null;
        return params.slice(1).join(' ');
      case CommandParamTypes.USERSTATE:
        if (data) return typeof data === 'string' ? userstate[data] : null;
        return userstate;
      case CommandParamTypes.CHANNEL:
        return channel;
      default:
        return null;
    }
  }
}
