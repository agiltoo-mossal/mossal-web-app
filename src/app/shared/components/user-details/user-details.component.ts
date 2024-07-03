import { Component, Input, ViewChild, computed, effect } from '@angular/core';
import { User } from 'src/graphql/generated';

import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
} from 'ng-apexcharts';
import { OverviewService } from 'src/app/dashboard/components/overview/overview.service';

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

  constructor(private collaboratorService: OverviewService) {
    this.chartOptions = {
      series: [0, 0],
      chart: {
        type: 'donut',
      },
      legend: {
        show: false,
      },
      labels: ['Total demande', 'Montant autorisé'],
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
    effect(() => {
      this.chartOptions.series = this.average;
    });
  }
  get average() {
    const dataColloborator = this.collaboratorService.getUserSelected;

    const somTotale = dataColloborator.authorizedAdvance;
    if (!somTotale || !dataColloborator) return [0, 0];
    const averageBalance = (dataColloborator?.balance ?? 0) / somTotale;
    const rest = 1 - averageBalance;
    return [
      Math.round(+(averageBalance * 100).toFixed(0)),
      Math.round(+(rest * 100).toFixed(0)),
    ];
  }
}
