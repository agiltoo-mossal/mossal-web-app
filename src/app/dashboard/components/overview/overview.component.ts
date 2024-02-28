import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
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
      color: '#40B139',
    },
  ];
}
