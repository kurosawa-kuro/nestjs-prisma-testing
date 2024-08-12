import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from "@/users/users.module";
import { CommonModule } from "@/lib/common.module";
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsersModule,
        CommonModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your_secret_key',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}