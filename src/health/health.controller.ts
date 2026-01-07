import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  async heck() {
    const d = await this.db.pingCheck('database');
    return {
      currtime: Date(),
      db: d,
    };
  }
}
