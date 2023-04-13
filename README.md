<div align="center">

# tmi-nestjs

tmi-nestjs is NestJS package for tmi.js

</div>

## Getting Started

```typescript
/**
 * If you chat "!sum 2 3",
 * The bot will reply with "@XxshiftxX 2 + 3 = 5"  
 */
@UseGuards(AuthGuard)
@Command({ name: '!sum' })
public sum(
  @Param(1, ParseIntPipe) first: number,
  @Param(2, ParseIntPipe) second: number,
  @Userstate('username') username: string,
) {
  const result = first + second;
  if (result > 10) return "over ten!";

  return `@${username} ${first} + ${second} = ${result}`;
}
```

## Installation

Start by installing the required packages:
```sh
$ npm i @tmi-nestjs/core tmi.js
$ npm i -D @types/tmi.js
```

We can import the `TmiModule` and configure it with the `forRoot()` static method.
The type of configs are satisfy [tmi.js config](https://tmijs.com/#guide-options).
```typescript
import { Module } from '@nestjs/common';
import { TmiModule } from '@tmi-nestjs/core';

@Module({
  imports: [
    TmiModule.forRoot({
      identity: {
        username: process.env.TMI_USERNAME,
        password: process.env.TMI_PASSWORD,
      },
      channels: [process.env.TMI_CHANNEL],
    }),
  ],
})
export class AppModule {}
```
