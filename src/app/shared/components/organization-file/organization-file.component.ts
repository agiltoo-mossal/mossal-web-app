import { Component, OnInit } from '@angular/core';
import { FetchSupportPaiementGQL } from 'src/graphql/generated';
import { SnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-organization-file',
  templateUrl: './organization-file.component.html',
  styleUrl: './organization-file.component.scss',
})
export class OrganizationFileComponent implements OnInit {
  constructor(
    private fetchSupportPaiement: FetchSupportPaiementGQL,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {}
  uploadDemande() {}

  downloadDemande() {
    this.fetchSupportPaiement.fetch().subscribe({
      next: ({ data }) => {
        const temps = data.fetchSupportPaiement;
        if (temps.length) {
          const csvRows = [
            [
              'Prenom',
              'Nom',
              'Email',
              'Identifiant unique',
              'Telephone',
              'Montant',
              'Avance renboursée',
            ],
            ...temps.map((row) => [
              row.firstName,
              row.lastName,
              row.email,
              row.uniqueIdentifier,
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
        } else {
          this.snackBarService.showSnackBar(
            "Aucune Demande de paiement n'a encore été effectue sur ce mois !"
          );
        }
      },
      error: (error) => console.log(error),
    });
  }
}
