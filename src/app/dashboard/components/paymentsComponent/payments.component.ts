import { Component } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']

})
export class PaymentsComponent {
    paiements = [
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
  ];
}