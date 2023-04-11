import { Controller, Logger } from '@nestjs/common';
import { Command } from '@tmi-nestjs/core';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Command({ name: '!테스트' })
  async test() {
    return '테스트용 커맨드입니다.';
  }
}
