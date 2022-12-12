import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Client } from 'tmi.js';

@Injectable()
export class TmiService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    private readonly client: Client,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async onApplicationShutdown() {
    await this.client.disconnect();
  }
}
