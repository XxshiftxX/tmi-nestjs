import { Controller, Logger } from '@nestjs/common';
import { Command } from '@tmi-nestjs/core';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Command()
  async test() {
    this.logger.log('test command!');
  }
}
