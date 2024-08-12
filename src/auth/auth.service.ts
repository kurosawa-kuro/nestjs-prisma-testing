import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async userId(request: Request): Promise<number> {
    const token = this.extractTokenFromRequest(request);

    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload.id;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromRequest(request: Request): string {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    if (request.cookies && request.cookies.jwt) {
      return request.cookies.jwt;
    }
    throw new UnauthorizedException('No token found');
  }
}