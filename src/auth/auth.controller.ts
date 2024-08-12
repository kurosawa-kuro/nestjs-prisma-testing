import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
    UnauthorizedException
  } from '@nestjs/common';
  import { UsersService } from '@/users/users.service';
  import * as bcrypt from 'bcryptjs';
  import { RegisterDto } from './models/register.dto';
  import { JwtService } from '@nestjs/jwt';
  import { Request, Response } from 'express';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Controller('auth')
  export class AuthController {
    constructor(
      private userService: UsersService,
      private jwtService: JwtService,
      private authService: AuthService
    ) {}
  
    @Post('register')
    async register(@Body() body: RegisterDto) {
      if (body.password !== body.passwordConfirm) {
        throw new BadRequestException('Passwords do not match!');
      }
  
      const hashed = await bcrypt.hash(body.password, 12);
  
      return this.userService.create({
        name: body.name,
        email: body.email,
        password: hashed,
      });
    }
  
    @Post('login')
    async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) response: Response
    ) {
      const user = await this.userService.findBy({ email: email });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      if (!await bcrypt.compare(password, user.password)) {
        throw new BadRequestException('Invalid credentials');
      }
  
      const jwt = await this.jwtService.signAsync({ id: user.id });
  
      response.cookie('jwt', jwt, { httpOnly: true });
  
      return user;
    }
  
    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        console.log("★★★★★★ Check user★★★★★★");
      try {
        const id = await this.authService.userId(request);
        const user = await this.userService.find(id);
  
        if (!user) {
          throw new NotFoundException('User not found');
        }
  
        // パスワードなどの機密情報を除外
        const { password, ...result } = user;
        return result;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new UnauthorizedException('Invalid token');
      }
    }
  
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
      response.clearCookie('jwt');
      return {
        message: 'Success'
      };
    }
  }