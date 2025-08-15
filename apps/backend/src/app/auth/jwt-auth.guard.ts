import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log(`JWT Guard: Processing request to ${context.switchToHttp().getRequest().url}`);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.error(`JWT Guard: Authentication failed - ${err?.message || info?.message || 'No user found'}`);
      throw new UnauthorizedException('Invalid token');
    }
    this.logger.log(`JWT Guard: Authentication successful for user: ${user.userId}`);
    return user;
  }
} 