import { ContextType, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ChatUserstate } from 'tmi.js';

export type TmiContextType = 'tmi' | ContextType;

export class TmiExecutionContext extends ExecutionContextHost {
  static create(context: ExecutionContext): TmiExecutionContext {
    const type = context.getType();
    const tmiContext = new TmiExecutionContext(
      context.getArgs(),
      context.getClass(),
      context.getHandler(),
    );
    tmiContext.setType(type as TmiContextType);
    return tmiContext;
  }

  getType<TContext extends string = TmiContextType>(): TContext {
    return super.getType();
  }

  getChannel(): string {
    return this.getArgByIndex(0);
  }

  getUserstate(): ChatUserstate {
    return this.getArgByIndex(1);
  }

  getMessage(): string {
    return this.getArgByIndex(2);
  }
}
