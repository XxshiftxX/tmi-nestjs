import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { Client } from 'tmi.js';
import { OnResolver } from './resolver/on.resolver';

@Injectable()
export class TmiService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly client: Client,
  ) {
    this.resolve();
  }

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async onApplicationShutdown() {
    await this.client.disconnect();
  }

  resolve() {
    const providers = this.discoveryService.getProviders();
    const controllers = this.discoveryService.getControllers();

    [...providers, ...controllers].forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance) return;

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (methodName: string) => {
          new OnResolver().resolve(instance, methodName, this.client);
        },
      );
    });
  }
}
