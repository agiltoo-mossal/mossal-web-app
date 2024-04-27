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
    console.log({
      metricsData: this.metricsData
    });
    this.chartOptions = {
      series: [
        {
          name: "Montant total",
          color: "#061E5C",
          data: [
            {
              x: "Dec 23 2017",
              y: 44
            },
            {
              x: "Dec 24 2017",
              y: 44
            },
            {
              x: "Dec 25 2017",
              y: 31
            },
            {
              x: "Dec 26 2017",
              y: 38
            },
            {
              x: "Dec 27 2017",
              y: 50
            },
            {
              x: "Dec 28 2017",
              y: 32
            },
            {
              x: "Dec 29 2017",
              y: 55
            },
            {
              x: "Dec 30 2017",
              y: 51
            },
            {
              x: "Dec 31 2017",
              y: 67
            },
            {
              x: "Jan 01 2018",
              y: 22
            },
            {
              x: "Jan 02 2018",
              y: 34
            },
            {
              x: "Jan 03 2018",
              y: 18
            },
            {
              x: "Jan 04 2018",
              y: 40
            },
            {
              x: "Jan 05 2018",
              y: 11
            },
            {
              x: "Jan 06 2018",
              y: 4
            },
            {
              x: "Jan 07 2018",
              y: 15
            },
            {
              x: "Jan 08 2018",
              y: 20
            },
            {
              x: "Jan 09 2018",
              y: 9
            },
            {
              x: "Jan 10 2018",
              y: 34
            },
            {
              x: "Jan 11 2018",
              y: 36
            },
            {
              x: "Jan 12 2018",
              y: 40
            },
            {
              x: "Jan 13 2018",
              y: 13
            },
            {
              x: "Jan 14 2018",
              y: 30
            }
          ],
        },
        {
          name: "Reste à payer",
          color: "#FFC708",
          data: [
            {
              x: "Dec 23 2017",
              y: 34
            },
            {
              x: "Dec 24 2017",
              y: 30
            },
            {
              x: "Dec 25 2017",
              y: 16
            },
            {
              x: "Dec 26 2017",
              y: 18
            },
            {
              x: "Dec 27 2017",
              y: 30
            },
            {
              x: "Dec 28 2017",
              y: 17
            },
            {
              x: "Dec 29 2017",
              y: 35
            },
            {
              x: "Dec 30 2017",
              y: 38
            },
            {
              x: "Dec 31 2017",
              y: 47
            },
            {
              x: "Jan 01 2018",
              y: 10
            },
            {
              x: "Jan 02 2018",
              y: 24
            },
            {
              x: "Jan 03 2018",
              y: 9
            },
            {
              x: "Jan 04 2018",
              y: 20
            },
            {
              x: "Jan 05 2018",
              y: 5
            },
            {
              x: "Jan 06 2018",
              y: 2
            },
            {
              x: "Jan 07 2018",
              y: 5
            },
            {
              x: "Jan 08 2018",
              y: 10
            },
            {
              x: "Jan 09 2018",
              y: 2
            },
            {
              x: "Jan 10 2018",
              y: 24
            },
            {
              x: "Jan 11 2018",
              y: 26
            },
            {
              x: "Jan 12 2018",
              y: 30
            },
            {
              x: "Jan 13 2018",
              y: 8
            },
            {
              x: "Jan 14 2018",
              y: 20
            }
          ],
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
