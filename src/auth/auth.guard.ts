import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("★★★★★★ Check canActivate★★★★★★");
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    console.log("★★★★★★ token ★★★★★★", token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    if (request.cookies && request.cookies.jwt) {
      return request.cookies.jwt;
    }
    return undefined;
  }
}