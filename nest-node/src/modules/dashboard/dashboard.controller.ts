import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('snapshot')
  getSnapshot() {
    return this.dashboardService.getSnapshot();
  }

  @Get('live')
  getLiveData() {
    return this.dashboardService.getLiveData();
  }

  @Get('history')
  getHistoricalData() {
    return this.dashboardService.getHistoricalData();
  }
}
