import { SetMetadata } from "@nestjs/common";
import { COMMAND_METADATA } from "../tmi.constants";

export const Command = (): MethodDecorator => {
  return (target: Object | Function, key?: string, descriptor?: any) => {
    SetMetadata(COMMAND_METADATA, {})(target, key, descriptor);
  };
};
