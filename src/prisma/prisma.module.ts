// src\prisma\prisma.module.ts

// External libraries
import { Module } from '@nestjs/common';

// Internal modules
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
