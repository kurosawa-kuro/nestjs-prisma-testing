// src\app.controller.ts

// External libraries
import { Controller, Get } from '@nestjs/common';

// Internal modules
import { AppService } from '@/app/services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDatabaseStatus(): Promise<string> {
    return this.appService.getDatabaseConnectionStatus();
  }
}
