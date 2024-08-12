import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogDemandeComponent } from '../dialog-demande/dialog-demande.component';

@Component({
  selector: 'app-organization-file',
  templateUrl: './organization-file.component.html',
  styleUrl: './organization-file.component.scss',
})
export class OrganizationFileComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  constructor(private fileService: FileUploadService) {}

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
            if ((res as any).data) {
              this.fileService.signalDataOrganisation.set((res as any).data);
              this.openDialog();
            } else {
            }
          },
          error: (error) => console.log(error),
        });
      };
    }
  }

  downloadDemande() {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogDemandeComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.fileService.signalDataOrganisation.set(null);
    });
  }
}
