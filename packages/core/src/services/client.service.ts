import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, Options } from "tmi.js";
import { TMI_MODULE_OPTIONS } from "../tmi.constants";

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);
  private _client: Client;

  public get client() { return this._client; }
  private set client(value: Client) { this._client = value; }

  constructor(
    @Inject(TMI_MODULE_OPTIONS) private readonly options: Options,
  ) {}

  initClient() {
    const optionsWithDefault = this.fillDefaultOption(this.options);
    const client = new Client(optionsWithDefault);

    this.client = client;
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