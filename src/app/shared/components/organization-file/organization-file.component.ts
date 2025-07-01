import { Component, effect, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FetchAccountantDataGQL, FetchSupportPaiementGQL } from 'src/graphql/generated';
import { SnackBarService } from '../../services/snackbar.service';
import * as XLSX from 'xlsx';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-organization-file',
  templateUrl: './organization-file.component.html',
  styleUrl: './organization-file.component.scss',
})
export class OrganizationFileComponent implements OnInit {
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  @Input() organisationServiceId: string;
  showModalOrganisation = false;
  dataOrganisationFile!: any;

  @Input() startDate: string;

  constructor(
    private fetchSupportPaiement: FetchSupportPaiementGQL,
    private snackBarService: SnackBarService,
    private fileService: FileUploadService,
    private fetchAccountantData: FetchAccountantDataGQL,
  ) {
    effect(() => {
      this.dataOrganisationFile = this.fileService.signalDataOrganisation();
      if (this.dataOrganisationFile) {
        this.showModalOrganisation = true;
      }  
    });
  }

  ngOnInit(): void {}
  async uploadDemande(event: Event) {
    const files = event.target as HTMLInputElement;
    if (files) {
      const file: File = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileService.sendFileEndpoint(file, `demande/upload`).subscribe({
          next: (res) => {
            const data = res as any;
            if (data.errorCount === 0) {
              this.snackBarService.showSnackBar(
                'Demande de paiement envoyé avec success !'
              );
            } else {
              this.snackBarService.showSnackBar(
                "Une erreur est survenue lors de l'envoi de la demande de paiement !"
              );
            }
            this.fileService.signalDataOrganisation.set((res as any).data);
          },
          error: (error) => console.log(error),
        });
      };
    }
  }

  downloadDemande() {
    this.fetchSupportPaiement.fetch({}, { fetchPolicy: 'no-cache' }).subscribe({
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
              'Service',
              'Montant',
              'Avance renboursée',
            ],
            ...temps.map((row) => [
              row.collaborator.firstName,
              row.collaborator.lastName,
              row.collaborator.email,
              row.collaborator.uniqueIdentifier,
              row.collaborator.phoneNumber,
              row.organisationService.service.title,
              row.amount,
              '',
            ]),
          ];
          this.convertToXLSX(csvRows, 'support-paiement');
        } else {
          this.snackBarService.showSnackBar(
            "Aucune Demande de paiement n'a encore été effectue sur ce mois !"
          );
        }
      },
      error: (error) => console.log(error),
    });
  }

  convertToXLSX(data: any[], filename: string) {
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
    this.saveAsExcelFile(excelBuffer, filename);
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
  closeModal() {
    this.showModalOrganisation = false;
    this.fileService.signalDataOrganisation.set(null);
  }

  downloadAccountantData() {
    this.fetchAccountantData.fetch({}, { fetchPolicy: 'no-cache' }).subscribe({
      next: ({ data }) => {
        const temps = data.fetchAccountantData;
        console.log("Accountant data ======>>>>>>>>> ", temps);
        console.log("startDate =====>>>>>>> ", this.startDate);
        
        // if (temps.length) {
        //   const csvRows = [
        //     [
        //       'Nom',
        //       'Prenom',
        //       'Matricule',
        //       'Telephone',
        //       'Organisation',
        //       'Numéro demande',
        //       'Montant',
        //       'Type d\'vance',
        //     ],
        //     ...temps.map((row) => [
        //       row.collaborator.lastName,
        //       row.collaborator.firstName,
        //       row.collaborator.uniqueIdentifier,
        //       row.collaborator.phoneNumber,
        //       'Mossall',
        //       row.number,
        //       row.amount,
        //       row.organisationService.service.title,
        //       '',
        //     ]),
        //   ];
        //   this.convertToXLSX(csvRows, 'fichier-comptable');
        // } else {
        //   this.snackBarService.showSnackBar(
        //     "Aucune Demande de paiement n'a encore été effectue sur ce mois !"
        //   );
        // }
      },
      error: (error) => console.log(error),
    });
  }
}
