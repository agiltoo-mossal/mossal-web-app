import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexTheme,
  ApexTitleSubtitle,
  ApexFill
} from "ng-apexcharts";
import { OperationsMetrics } from 'src/graphql/generated';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  theme: ApexTheme;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-operation-charts',
  templateUrl: './operation-charts.component.html',
  styleUrl: './operation-charts.component.scss'
})

export class OperationChartsComponent {
  @Input() metricsData: OperationsMetrics;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions = {
      series: [
        {
          name: "Crédit",
          color: "#061E5C",
          data: this.metricsData.credit as any,
        },
        {
          name: "Débit",
          color: "#FFC708",
          data: this.metricsData.debit as any,
        }
      ],
      chart: {
        type: "area",
        height: 350,
        animations: {
          enabled: false
        },
        zoom: {
          enabled: false
        },
        redrawOnParentResize: true,
        redrawOnWindowResize: true,

      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 2,
        lineCap: 'butt'
      },
      fill: {
        type: "gradient",
        colors: ["#061E5C", "#FFC708"],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.2,
          opacityTo: 0.4,
          stops: [0, 100],

        }
      },
      markers: {
        size: 5,
        hover: {
          size: 9
        }
      },
      title: {
        text: "Vue d’ensemble des opérations"
      },
      tooltip: {
        intersect: true,
        shared: false
      },
      theme: {
        palette: "palette1"
      },
      xaxis: {
        type: 'category'
      },
      yaxis: {
        title: {
          text: "Montant"
        }
      }
    };
  }

  formatDataForChart(data: any[]) {
    return data.map(item => ({
      x: this.getMonthName(item.month) + ' ' + item.year,
      y: item.amount
    }));
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthNumber - 1] || '';
  }

}
