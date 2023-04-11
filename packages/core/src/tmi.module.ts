import { DynamicModule, Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Options } from 'tmi.js';
import { ClientService } from './services/client.service';
import { TMI_MODULE_OPTIONS } from './tmi.constants';

@Module({
  providers: [ClientService],
})
export class TmiModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(TMI_MODULE_OPTIONS) private readonly options: Options,
    private readonly clientService: ClientService,
  ) {}

  static forRoot(options: Options = {}): DynamicModule {
    return {
      module: TmiModule,
      providers: [
        { provide: TMI_MODULE_OPTIONS, useValue: options }
      ],
    };
  }

  async onModuleInit() {
    this.clientService.initClient();

    await this.clientService.client.connect();
  }

  async onModuleDestroy() {
    await this.clientService.client.disconnect();
  }
}
