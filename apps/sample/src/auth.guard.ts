import { Injectable, CanActivate, Logger } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly logger = new Logger(AuthGuard.name);

  canActivate(): boolean {
    AuthGuard.logger.log('AuthGuard#canActivate called');

    return true;
  }
}
