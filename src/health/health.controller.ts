import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/auth.guard';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}
  @Get()
  @Public()
  @HealthCheck()
  async check() {
    const d = await this.db.pingCheck('database');
    return {
      currtime: Date(),
      db: d.database.status,
    };
  }
}
