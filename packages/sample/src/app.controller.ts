import { Controller } from '@nestjs/common';
import {
  On, OnCommand, Parameter, Rest, UserState,
} from '@tmi-nestjs/core';
import { ChatUserstate, Userstate } from 'tmi.js';

@Controller()
export class AppController {
  @On({ events: 'message' })
  async handler(channel: string, tags: ChatUserstate, message: string, self: boolean) {
    if (self) return;

    console.log(channel, message);
  }

  @OnCommand({ prefix: '!' })
  async command(
    @UserState() userstate: Userstate,
    @Parameter() first: string,
    @Parameter() second: string,
    @Rest() rest: string,
  ) {
    console.log('username', userstate.username);
    console.log('first', first);
    console.log('second', second);
    console.log('rest', rest);
  }
}
