import { Controller, ParseIntPipe } from '@nestjs/common';
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

  @OnCommand({ prefix: '!', command: '커맨드' })
  async command(
    @UserState() userstate: Userstate,
    @Parameter() first: string,
    @Parameter() second: string,
    @Rest() rest: string,
  ) {
    return `[${userstate.username} first: ${first} | second: ${second} | rest: ${rest}`;
  }

  @OnCommand({ prefix: '!', command: '덧셈' })
  async add(
    @Parameter(new ParseIntPipe()) first: number,
    @Parameter(new ParseIntPipe()) second: number,
  ) {
    return `${first} + ${second} = ${first + second}`;
  }
}
