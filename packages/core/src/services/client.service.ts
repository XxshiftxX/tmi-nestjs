import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, Options, Userstate } from 'tmi.js';
import { CommandMetadata } from '../decorators';
import { TMI_MODULE_OPTIONS } from '../tmi.constants';
import { CommandsExplorerService } from './commands-explorer.service';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  private _client: Client;

  public get client() { return this._client; }

  private set client(value: Client) { this._client = value; }

  constructor(
    @Inject(TMI_MODULE_OPTIONS) private readonly options: Options,
    private readonly commandsExplorer: CommandsExplorerService,
  ) { }

  async start() {
    const optionsWithDefault = this.fillDefaultOption(this.options);
    const client = new Client(optionsWithDefault);

    this.client = client;
    this.client.on('connecting', (address, port) => this.logger.log(`Client connecting... ${address}:${port}`));
    this.client.on('connected', (address, port) => this.logger.log(`Client connected! ${address}:${port}`));
    this.client.on('disconnected', (reason) => this.logger.error(`Client disconnected!\n${reason}`));

    this.bindCommands();

    await client.connect();
  }

  async stop() {
    await this.client?.disconnect();
  }

  private bindCommands() {
    const commands = this.commandsExplorer.explore();

    this.client.on('chat', async (channel, userstate, message, self) => {
      if (self) return;

      const [commandName] = message.split(' ');
      const command = commands.find((command) => command.metadata.name === commandName);
      if (!command) return;

      const result = await command.callback(channel, userstate, message);
      if (typeof result !== 'string') return;

      this.client.say(channel, result);
    });
  }

  private fillDefaultOption(options: Options): Options {
    const defaultOptions: Options = {
      logger: {
        error: this.logger.error,
        info: this.logger.log,
        warn: this.logger.warn,
      },
    };

    return { ...defaultOptions, ...options };
  }
}
