import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
import { DemandesMetrics } from 'src/graphql/generated';

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
  selector: 'app-refund-charts',
  templateUrl: './refund-charts.component.html',
  styleUrl: './refund-charts.component.scss',
})
export class RefundChartsComponent implements OnChanges {
  @Input() metricsData: DemandesMetrics;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions = {
      series: [
        {
          name: "Montant total",
          color: "#061E5C",
          data: this.metricsData.total as any,
        },
        {
          name: "Reste à payer",
          color: "#FFC708",
          data: this.metricsData.remaining as any,
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
        text: "Vue d’ensemble des remboursements"
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
}
