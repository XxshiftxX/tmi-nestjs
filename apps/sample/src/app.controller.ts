import { Controller } from "@nestjs/common";
import { Command } from "@tmi-nestjs/core";

@Controller()
export class AppController {
  @Command()
  async test() {
    console.log('command!');
  }
}
