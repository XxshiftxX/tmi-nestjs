import { Injectable, UseGuards } from '@nestjs/common';
import { Command, Param, Userstate } from '@tmi-nestjs/core';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AppGateway {
  @UseGuards(AuthGuard)
  @Command({ name: '!테스트' })
  async test(
    @Param(1) first: string,
    @Userstate('username') username: string,
    @Userstate('display-name') displayName: string,
  ) {
    return `테스트용 커맨드입니다 ${username} ${displayName} ${first}`;
  }
}
