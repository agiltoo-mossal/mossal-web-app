import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FetchSupportPaiementGQL } from 'src/graphql/generated';
import { FileUploadService } from '../../services/file-upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization-file',
  templateUrl: './organization-file.component.html',
  styleUrl: './organization-file.component.scss',
})
export class OrganizationFileComponent implements OnInit {
  constructor(
    private fetchSupportPaiement: FetchSupportPaiementGQL,
    private fileService: FileUploadService
  ) {}

  ngOnInit(): void {}
  async uploadDemande(event: Event) {
    const files = event.target as HTMLInputElement;
    if (files) {
      const file: File = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        console.log(file);
        this.fileService.sendFileEndpoint(file, `demande/upload`).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (error) => console.log(error),
        });
      };
    }
  }

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
