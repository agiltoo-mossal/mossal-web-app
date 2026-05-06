import { Component } from '@angular/core';

interface ValidationRow {
  nom: string;
  prenom: string;
  telephone: string;
  montant: string;
  operateur: string;
  errors?: string[];
}

@Component({
  selector: 'app-import-fichier',
  templateUrl: './import-fichier.component.html',
  styleUrls: ['./import-fichier.component.scss']
})
export class ImportFichierComponent {

  step: 'upload' | 'validation' = 'upload';
  selectedFile: File | null = null;
  fileError: string = '';
  isDragging = false;

  readonly ACCEPTED_EXTENSIONS = ['.xlsx', '.xls'];
  readonly ACCEPTED_MIME = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  validationRows: ValidationRow[] = [
    { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: '120.000 XOF', operateur: 'Wave' },
    { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 7 7',   montant: '120.000 XOF', operateur: 'Orange Money', errors: ['telephone'] },
    { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: '120.000 XOF', operateur: 'Orange Money' },
    { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: '',             operateur: 'Wave',         errors: ['montant'] },
    { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: '120.000 XOF', operateur: 'Orange Money' },
    { nom: 'DIOP', prenom: 'Laurent', telephone: '',             montant: '120.000 XOF', operateur: 'Orange Money', errors: ['telephone_vide'] },
    { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: '120.000 XOF', operateur: 'Wave' },
    { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: '120.000 XOF', operateur: 'Orange Money' },
  ];

  get errorCount(): number {
    return this.validationRows.filter(r => r.errors && r.errors.length > 0).length;
  }

  // ── Gestion du fichier 

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  processFile(file: File): void {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!this.ACCEPTED_EXTENSIONS.includes(ext)) {
      this.selectedFile = null;
      this.fileError = `Format non supporté. Veuillez sélectionner un fichier .xlsx ou .xls`;
    } else {
      this.selectedFile = file;
      this.fileError = '';
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / 1048576).toFixed(1)} Mo`;
  }

  onConfirmImport(): void {
    if (this.selectedFile && !this.fileError) {
      this.step = 'validation';
    }
  }

  onCancel(): void {
    this.selectedFile = null;
    this.fileError = '';
  }

      // Navigation vers l'étape suivante (Récapitulatif)
  onValidate(): void {
    console.log('Naviguer vers le récapitulatif');
  }
}