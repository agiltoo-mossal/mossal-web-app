import { Component, OnInit } from '@angular/core';
import { FetchSupportPaiementGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-organization-file',
  templateUrl: './organization-file.component.html',
  styleUrl: './organization-file.component.scss',
})
export class OrganizationFileComponent implements OnInit {
  constructor(private fetchSupportPaiement: FetchSupportPaiementGQL) {}

  ngOnInit(): void {}
  uploadDemande() {}

  downloadDemande() {
    this.fetchSupportPaiement.fetch().subscribe({
      next: ({ data }) => {
        const temps = data.fetchSupportPaiement;
        if (temps) {
          const csvRows = [
            [
              'Prenom',
              'Nom',
              'Email',
              'Telephone',
              'Montant',
              'Avance renboursée',
            ],
            ...temps.map((row) => [
              row.firstName,
              row.lastName,
              row.email,
              row.phoneNumber,
              row.amount,
              '',
            ]),
          ]
            .map((e) => e.join(','))
            .join('\n');
          const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('href', url);
          a.setAttribute('download', 'support-paiement.csv');
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (error) => console.log(error),
    });
  }
}
