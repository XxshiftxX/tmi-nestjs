import { Userstate } from 'tmi.js';
import { CommandParamTypes } from '../decorators';

export const exchangeKeyForValue = (
  key: CommandParamTypes,
  value: string | object | any,
  { channel, userstate, message } : { channel: string; userstate: Userstate; message: string },
) => {
  const params = message.split(' ');
  switch (key) {
    case CommandParamTypes.PARAM:
      return value ? params[value] : params;
    default:
      return null;
  }
};
