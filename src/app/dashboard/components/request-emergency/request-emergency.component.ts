import { Component } from '@angular/core';

@Component({
  selector: 'app-request-emergency',
  templateUrl: './request-emergency.component.html',
  styleUrl: './request-emergency.component.scss',
})
export class RequestEmergencyComponent {
  title: string = "Dépannage d'urgence"; // Titre dynamique
  data = [
    {
      id: 215,
      collaborateur: 'Laurent Diop',
      solde: '475 000 XOF',
      date: '06-06-2022',
      montant: '100 000 XOF',
      status: 'En attente',
    },
    {
      id: 215,
      collaborateur: 'Laurent Diop',
      solde: '475 000 XOF',
      date: '06-06-2022',
      montant: '100 000 XOF',
      status: 'Validé',
    },
    {
      id: 215,
      collaborateur: 'Laurent Diop',
      solde: '475 000 XOF',
      date: '06-06-2022',
      montant: '100 000 XOF',
      status: 'Rejeté',
    },
    {
      id: 215,
      collaborateur: 'Laurent Diop',
      solde: '475 000 XOF',
      date: '06-06-2022',
      montant: '100 000 XOF',
      status: 'Remboursé',
    },
    {
      id: 215,
      collaborateur: 'Laurent Diop',
      solde: '475 000 XOF',
      date: '06-06-2022',
      montant: '100 000 XOF',
      status: 'En attente',
    },
  ];
}
