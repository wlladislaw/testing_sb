import { Injectable } from '@nestjs/common';

@Injectable()
export class ChartService {
  private chartData = [
    { label: 'Личный транспорт', value: 24, color: '#117F8B' },
    { label: 'Транспорт', value: 6, color: '#47A2FD' },
    { label: 'Аптеки', value: 12, color: '#31C1A6' },
    { label: 'Непродовольственные магазины', value: 5, color: '#FE9702' },
    { label: 'Предоставление услуг', value: 10, color: '#0574E0' },
    { label: 'Кафе/бары/рестораны', value: 4, color: '#DB1337' },
    { label: 'Развлечения', value: 7, color: '#7F67E1' },
    { label: 'Продовольственные магазины', value: 4, color: '#4D2BD6' },
    { label: 'Средства размещения', value: 7, color: '#3BB2CD' },
    { label: 'Прочее', value: 33, color: '#D0D7DD' },
  ];

  async getFullData() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return this.chartData;
  }
}
