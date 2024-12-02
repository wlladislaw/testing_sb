import { Controller, Get } from '@nestjs/common';
import { ChartService } from './chart.service';

@Controller('chart')
export class ChartController {
  constructor(private chartService: ChartService) {}
  @Get('data')
  async getData() {
    return await this.chartService.getFullData();
  }
}
