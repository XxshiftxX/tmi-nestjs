import { DynamicModule, Module } from '@nestjs/common';
import { Client, Options } from 'tmi.js';
import { DISCORD_MODULE_OPTIONS } from './constants/tmi-module-option.constant';
import { TmiService } from './tmi.service';

@Module({})
export class TmiModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: TmiModule,
      providers: [
        {
          provide: DISCORD_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: Client,
          useValue: new Client(options),
        },
        TmiService,
      ],
    };
  }
}
