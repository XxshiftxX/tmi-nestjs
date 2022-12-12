import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Client, Options } from 'tmi.js';

@Module({})
export class TmiModule {
  static forRoot(options: Options): DynamicModule {
    const TmiClientProvider: Provider = {
      provide: Client,
      useFactory: async () => {
        const client = new Client(options);

        await client.connect();

        return client;
      },
    };

    return {
      module: TmiModule,
      providers: [
        TmiClientProvider,
      ],
    };
  }
}
