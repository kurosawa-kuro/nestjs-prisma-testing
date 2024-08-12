import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
  import { RegisterDto } from './register.model';
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('register')
    async register(@Body() body: RegisterDto) {
      return this.authService.register(body);
    }
  
    @Post('login')
    async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) response: Response
    ) {
      const { user, token } = await this.authService.login(email, password);
      response.cookie('jwt', token, { httpOnly: true });
      return user;
    }
  
    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
      return this.authService.getCurrentUser(request);
    }
  
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
      this.authService.logout(response);
      return { message: 'Success' };
    }
  }