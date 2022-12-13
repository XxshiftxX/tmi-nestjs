import { Controller } from '@nestjs/common';
import { On } from '@tmi-nestjs/core';
import { ChatUserstate } from 'tmi.js';

@Controller()
export class AppController {
  @On({ events: 'message' })
  async handler(channel: string, tags: ChatUserstate, message: string, self: boolean) {
    console.log(channel, message);
  }
}
