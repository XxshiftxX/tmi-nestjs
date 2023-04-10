import { DynamicModule, Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, Options } from 'tmi.js';
import { TMI_CLIENT, TMI_MODULE_OPTIONS } from './tmi.constants';

@Module({})
export class TmiModule implements OnModuleInit, OnModuleDestroy {
  private static readonly logger = new Logger(TmiModule.name, {
    timestamp: true,
  });

  constructor(
    @Inject(TMI_MODULE_OPTIONS) private readonly options: Options,
    @Inject(TMI_CLIENT) private readonly client: Client,
  ) {}

  static forRoot(options: Options = {}): DynamicModule {
    const optionsWithDefault = TmiModule.fillDefaultOption(options);
    const client = new Client(optionsWithDefault);

    return {
      module: TmiModule,
      providers: [
        {
          provide: TMI_MODULE_OPTIONS,
          useValue: optionsWithDefault,
        },
        {
          provide: TMI_CLIENT,
          useValue: client,
        },
      ],
    };
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  private static fillDefaultOption(options: Options): Options {
    const defaultOptions: Options = {
      logger: {
        error: TmiModule.logger.error,
        info: TmiModule.logger.log,
        warn: TmiModule.logger.warn,
      },
    };

    return { ...defaultOptions, ...options };
  }
}
