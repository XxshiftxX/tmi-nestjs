import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, Options, Userstate } from 'tmi.js';
import { CommandParamMetadata } from '../decorators';
import { COMMAND_PARAMETER_METADATA, TMI_MODULE_OPTIONS } from '../tmi.constants';
import { exchangeKeyForValue } from '../utils/command-params-factory';
import { CommandsExplorerService, CommandType } from './commands-explorer.service';

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

      const [commandName, ...commandArguments] = message.split(' ');
      const command = commands.find((command) => command.metadata.name === commandName);
      if (!command) return;

      const result = await this.executeCommand(command, channel, userstate, message);
      if (typeof result !== 'string') return;

      this.client.say(channel, result);
    });
  }

  private async executeCommand(
    command: CommandType,
    channel: string,
    userstate: Userstate,
    message: string,
  ) {
    const { instance, methodName } = command;
    const { constructor } = instance;
    this.logger.log(`Command executed:${constructor.name}:${methodName}`);

    const metadataMap = Reflect.getMetadata(COMMAND_PARAMETER_METADATA, constructor, methodName);
    const metadata: CommandParamMetadata[] = Object.values(metadataMap);
    const maxIndex = metadata.sort((a, b) => b.index - a.index)[0];

    const sorted = new Array(maxIndex.index + 1).fill(null)
      .map((_, index) => metadata.find((metadata) => metadata.index === index));

    const args = sorted.map((metadata) => (
      metadata
        ? exchangeKeyForValue(metadata.paramtype, metadata.data, { channel, userstate, message })
        : null
    ));

    this.logger.log(JSON.stringify(Object.values(metadata)));
    this.logger.log(JSON.stringify(args));

    return command.instance[command.methodName](...args);
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
