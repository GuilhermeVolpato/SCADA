import { Controller, Get, MessageEvent, Sse } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Observable } from 'rxjs';
import { Public } from 'src/common/decorators/public.decorator';

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
  
  @Public()
  @Sse('live/stream')
  getLiveDataStream(): Observable<MessageEvent> {
    return this.dashboardService.getLiveDataStream();
  }

  @Get('history')
  getHistoricalData() {
    return this.dashboardService.getHistoricalData();
  }
}
