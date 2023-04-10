import { Module } from "@nestjs/common";
import { TmiModule } from "@tmi-nestjs/core";

@Module({
  imports: [
    TmiModule.forRoot(),
  ],
})
export class AppModule {}
