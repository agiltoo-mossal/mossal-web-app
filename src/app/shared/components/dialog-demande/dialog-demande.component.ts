import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
} from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-dialog-demande',

  templateUrl: './dialog-demande.component.html',
  styleUrl: './dialog-demande.component.scss',
})
export class DialogDemandeComponent {
  data: any[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'error'];

  constructor(
    private fileService: FileUploadService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      this.data = this.fileService.signalDataOrganisation();
      console.log(this.data);
      this.cdr.markForCheck(); // Signaler à Angular de vérifier les changements
    });
  }
}
