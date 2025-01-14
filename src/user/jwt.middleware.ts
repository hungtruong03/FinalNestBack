import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
   

    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
          throw new UnauthorizedException('Authorization header is missing');
        }
    
        const token = authHeader.split(' ')[1];
    
        if (!token) {
          throw new UnauthorizedException('Token is missing');
        }
        const decoded = this.jwtService.verify(token);
        req['email'] = decoded.email;
        req['isGoogleAccount'] = decoded.isGoogleAccount;

        next();
    } catch (error) {
        console.log(error)
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
