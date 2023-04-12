import { DynamicModule, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ExternalContextCreator, MetadataScanner, ModulesContainer } from '@nestjs/core';
import { Options } from 'tmi.js';
import { ClientService } from './services/client.service';
import { CommandsExplorerService } from './services/commands-explorer.service';
import { TMI_MODULE_OPTIONS } from './tmi.constants';

@Module({
  providers: [
    MetadataScanner,
    ClientService,
    CommandsExplorerService,
    ExternalContextCreator,
    ModulesContainer,
  ],
})
export class TmiModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly clientService: ClientService,
  ) {}

  static forRoot(options: Options = {}): DynamicModule {
    return {
      module: TmiModule,
      providers: [
        { provide: TMI_MODULE_OPTIONS, useValue: options },
      ],
    };
  }

  async onModuleInit() {
    await this.clientService.start();
  }

  async onModuleDestroy() {
    await this.clientService.stop();
  }
}
