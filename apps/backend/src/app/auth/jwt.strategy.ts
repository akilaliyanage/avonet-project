import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    const issuerUrl = process.env.AUTH0_ISSUER_URL;
    const jwksUri = `${issuerUrl}.well-known/jwks.json`;
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      issuer: issuerUrl,
      algorithms: ['RS256'],
    });
    
    this.logger.log(`Initializing JWT Strategy with issuer: ${issuerUrl}`);
    this.logger.log(`JWKS URI: ${jwksUri}`);
  }

  async validate(payload: any) {
    this.logger.log(`JWT Strategy: Validating payload`);
    this.logger.log(`JWT Strategy: Payload keys: ${Object.keys(payload)}`);
    this.logger.log(`JWT Strategy: sub (user ID): ${payload.sub}`);
    this.logger.log(`JWT Strategy: email: ${payload.email}`);
    this.logger.log(`JWT Strategy: name: ${payload.name}`);
    
    return { 
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };
  }
} 