import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TmiModule } from '@tmi-nestjs/core';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local' }),
    TmiModule.forRoot({
      identity: {
        username: process.env.TMI_USERNAME,
        password: process.env.TMI_PASSWORD,
      },
      channels: [process.env.TMI_CHANNEL],
    }),
  ],
  providers: [
    AppGateway,
  ],
})
export class AppModule {}
