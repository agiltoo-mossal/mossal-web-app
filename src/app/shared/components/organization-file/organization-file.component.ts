import { Component, OnInit } from '@angular/core';
import { FetchSupportPaiementGQL } from 'src/graphql/generated';
import { SnackBarService } from '../../services/snackbar.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-organization-file',
  templateUrl: './organization-file.component.html',
  styleUrl: './organization-file.component.scss',
})
export class OrganizationFileComponent implements OnInit {
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

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
          ];
          this.convertToXLSX(csvRows);
        } else {
          this.snackBarService.showSnackBar(
            "Aucune Demande de paiement n'a encore été effectue sur ce mois !"
          );
        }
      },
      error: (error) => console.log(error),
    });
  }

  convertToXLSX(data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
      skipHeader: true,
    });
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'support-paiement');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}${this.EXCEL_EXTENSION}`);
    a.click();
    window.URL.revokeObjectURL(url);
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
  }
}
