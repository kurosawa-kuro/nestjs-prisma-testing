// src/prisma/prisma.service.ts

import { Injectable } from '@nestjs/common';
import { AbstractPrismaService } from '../common/abstract.prisma.service';

@Injectable()
export class PrismaService extends AbstractPrismaService {}