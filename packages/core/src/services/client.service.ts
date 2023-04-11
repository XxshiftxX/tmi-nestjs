import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, Options } from "tmi.js";
import { TMI_MODULE_OPTIONS } from "../tmi.constants";
import { CommandsExplorerService } from "./commands-explorer.service";

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);
  private _client: Client;

  public get client() { return this._client; }
  private set client(value: Client) { this._client = value; }

  constructor(
    @Inject(TMI_MODULE_OPTIONS) private readonly options: Options,
    private readonly commandsExplorer: CommandsExplorerService,
  ) {}

  async start() {
    const optionsWithDefault = this.fillDefaultOption(this.options);
    const client = new Client(optionsWithDefault);

    this.client = client;
    const commands = this.commandsExplorer.explore();

    await client.connect();
  }

  async stop() {
    await this.client?.disconnect();
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