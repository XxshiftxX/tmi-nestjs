import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TmiModule } from '@tmi-nestjs/core';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TmiModule.forRoot({
      identity: {
        username: process.env.TMI_USERNAME,
        password: process.env.TMI_PASSWORD,
      },
      channels: [process.env.TMI_CHANNEL ?? ''],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
