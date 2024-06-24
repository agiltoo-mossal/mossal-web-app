import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
export class UserDetailsComponent implements OnChanges {
  @Input() user: User;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions = {
      series: [this.user?.totalDemandeAmount, this.user?.authorizedAdvance - this.user?.totalDemandeAmount],
      chart: {
        type: 'donut',
      },
      legend: {
        show: false,
      },
      labels: ['Total demande', 'Montant autorisé'],
      colors: ['#FFC708','#BDBDBD'],
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
