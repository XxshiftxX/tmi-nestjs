import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Client, Options } from 'tmi.js';
import { TMI_MODULE_OPTIONS } from './constants/tmi-module-option.constant';
import { TmiService } from './tmi.service';

@Module({ imports: [DiscoveryModule] })
export class TmiModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: TmiModule,
      providers: [
        {
          provide: TMI_MODULE_OPTIONS,
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
