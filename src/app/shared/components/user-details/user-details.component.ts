import { Component, Input, ViewChild } from '@angular/core';
import { User } from 'src/graphql/generated';

import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  legend: ApexLegend;
  labels: string[];
  colors: string[];
};

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  @Input() user: User;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [35, 65],
      chart: {
        type: 'donut',
      },
      legend: {
        show: false,
      },
      labels: ['Reste a payer', 'Remboursée'],
      colors: ['#FFC708', '#BDBDBD'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              // width: 100,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
}
