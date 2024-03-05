import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  cardPrevData = [
    {
      label: 'Montant total demandé',
      devis: 'XOF',
      value: '2.500.000',
      img: './assets/img/data-preview-img1.svg',
      color: '#061E5C',
    },
    {
      label: 'Reste total à payer',
      devis: 'XOF',
      value: '1.500.000',
      img: './assets/img/data-preview-img2.svg',
      color: '#FFC708',
    },
    {
      label: 'Actifs du 1 jan 2022 au 31 dec 2022',
      devis: '',
      value: '220',
      img: './assets/img/data-preview-img3.svg',
      color: '#40B139',
    },
    {
      label: 'Inscrits du 1 jan au 31 dec 2022',
      devis: '',
      value: '200',
      img: './assets/img/data-preview-img4.svg',
      color: '#F41414',
    },
  ];

  userList = [{}, {}, {}, {}, {}, {}, {}];

  // pieChart: GoogleChartInterface = {
  //   chartType: GoogleChartType.PieChart, // or chartType: 'PieChart'
  //   dataTable: [
  //     ['Task', 'Hours per Day'],
  //     ['Work', 11],
  //     ['Eat', 2],
  //     ['Commute', 2],
  //     ['Watch TV', 2],
  //     ['Sleep', 7],
  //   ],
  //   // firstRowIsData: true,
  //   options: { title: 'Tasks' },
  // };

  ngOnInit(): void {}
  chartData: GoogleChartInterface = {
    // chartType: 'LineChart',
    chartType: GoogleChartType.LineChart,
    dataTable: [
      [1, 37.8, 80.8, 41.8],
      [2, 30.9, 69.5, 32.4],
      [3, 25.4, 57, 25.7],
      [4, 11.7, 18.8, 10.5],
      [5, 11.9, 17.6, 10.4],
      [6, 8.8, 13.6, 7.7],
      [7, 7.6, 12.3, 9.6],
      [8, 12.3, 29.2, 10.6],
      [9, 16.9, 42.9, 14.8],
      [10, 12.8, 30.9, 11.6],
      [11, 5.3, 7.9, 4.7],
      [12, 6.6, 8.4, 5.2],
      [13, 4.8, 6.3, 3.6],
      [14, 4.2, 6.2, 3.4],
    ],
    // columnNames: [
    //   'Day',
    //   'Guardians of the Galaxy',
    //   'The Avengers',
    //   'Transformers: Age of Extinction',
    // ],
    options: {
      hAxis: {
        title: 'Box Office Earnings in First Two Weeks of Opening',
      },
      vAxis: {
        title: 'in millions of dollars (USD)',
      },
    },
    // width: 1000,
    // height: 400,
  };
}
