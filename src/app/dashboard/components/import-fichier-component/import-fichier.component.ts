import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { CreateBulkPaymentOrderGQL, BulkPaymentInput, Wallet } from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

interface ValidationRow {
  nom: string;
  prenom: string;
  telephone: string;
  montant: string;
  motif: string;
  operateur: string;
  errors?: string[];
}

@Component({
  selector: 'app-import-fichier',
  templateUrl: './import-fichier.component.html',
  styleUrls: ['./import-fichier.component.scss']
})
export class ImportFichierComponent {

  step: 'upload' | 'validation' | 'recapitulatif' = 'upload';

  selectedFile: File | null = null;
  fileError: string = '';
  isDragging = false;
  isSubmitting = false;
  isEditing = false;

  readonly OPERATEURS = ['Wave', 'Orange Money'];

  readonly ACCEPTED_EXTENSIONS = ['.xlsx', '.xls'];

  private readonly COLUMN_MAP: Record<string, keyof Omit<ValidationRow, 'errors'>> = {
    'nom':       'nom',
    'prenom':    'prenom',
    'prénom':    'prenom',
    'telephone': 'telephone',
    'téléphone': 'telephone',
    'montant':   'montant',
    'motif':     'motif',
    'operateur': 'operateur',
    'opérateur': 'operateur',
  };

  private readonly WALLET_MAP: Record<string, Wallet> = {
    'wave':         Wallet.Wave,
    'orange money': Wallet.OrangeMoney,
    'orange':       Wallet.OrangeMoney,
  };

  validationRows: ValidationRow[] = [];

  recapitulatif = {
    fichier: '',
    beneficiaires: 0,
    montantTotal: '0 XOF',
    operateurs: 0,
    repartition: [] as {
      nom: string;
      beneficiaires: number;
      montant: string;
      pourcentage: number;
      couleur: string;
    }[],
    approbateurs: [
      { nom: 'Khadija Sarr', role: 'Approbateur 1', statut: 'En attente', avatar: 'KS' },
      { nom: 'Mahié Sarr',   role: 'Approbateur 2', statut: 'En attente', avatar: 'MS' }
    ]
  };

  private readonly OPERATEUR_COLORS: Record<string, string> = {
    'wave':         '#06b6d4',
    'orange money': '#f97316',
    'free money':   '#8b5cf6',
    'mtn':          '#eab308',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private createBulkPaymentOrderGQL: CreateBulkPaymentOrderGQL,
    private snackBar: SnackBarService,
  ) {}

  get errorCount(): number {
    return this.validationRows.filter(r => r.errors && r.errors.length > 0).length;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.processFile(input.files[0]);
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
      this.fileError = 'Format non supporté. Veuillez sélectionner un fichier .xlsx ou .xls';
    } else {
      this.selectedFile = file;
      this.fileError = '';
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024)    return `${bytes} o`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / 1048576).toFixed(1)} Mo`;
  }

  onConfirmImport(): void {
    if (this.selectedFile && !this.fileError) {
      this.parseExcelFile(this.selectedFile);
    }
  }

  onCancel(): void {
    this.selectedFile = null;
    this.fileError   = '';
    this.validationRows = [];
  }

  private parseExcelFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data     = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet    = workbook.Sheets[workbook.SheetNames[0]];

        const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: false,
        });

        if (rawRows.length === 0) {
          this.fileError = 'Le fichier est vide ou ne contient pas de données.';
          return;
        }

        this.validationRows = rawRows.map(raw => this.mapRow(raw));
        this.step = 'validation';

      } catch (err) {
        this.fileError = 'Impossible de lire le fichier. Vérifiez qu\'il s\'agit bien d\'un fichier Excel valide.';
        console.error('Erreur lecture Excel:', err);
      }
    };

    reader.onerror = () => {
      this.fileError = 'Erreur lors de la lecture du fichier.';
    };

    reader.readAsArrayBuffer(file);
  }

  private mapRow(raw: Record<string, unknown>): ValidationRow {
    const get = (field: keyof Omit<ValidationRow, 'errors'>): string => {
      for (const rawKey of Object.keys(raw)) {
        if (this.COLUMN_MAP[this.normalize(rawKey)] === field) {
          return String(raw[rawKey] ?? '').trim();
        }
      }
      return '';
    };

    const nom       = get('nom');
    const prenom    = get('prenom');
    const telephone = get('telephone');
    const montant   = get('montant');
    const motif     = get('motif');
    const operateur = get('operateur');

    const errors: string[] = [];

    if (!telephone) {
      errors.push('telephone_vide');
    } else if (!this.isValidSenegalPhone(telephone)) {
      errors.push('telephone');
    }

    if (!montant) {
      errors.push('montant');
    }

    return { nom, prenom, telephone, montant, motif, operateur, errors };
  }

  private normalize(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  private isValidSenegalPhone(phone: string): boolean {
    const digits = phone.replace(/[\s\-\+\(\)\.]/g, '');
    if (/^[73]\d{8}$/.test(digits)) return true;
    if (/^221[73]\d{8}$/.test(digits)) return true;
    return false;
  }

  onValidate(): void {
    if (this.errorCount > 0) {
      this.isEditing = true;
      return;
    }
    this.buildRecapitulatif();
    this.step = 'recapitulatif';
  }

  onSaveEdits(): void {
    this.validationRows = this.validationRows.map(row => this.revalidateRow(row));
    this.isEditing = false;
  }

  private revalidateRow(row: ValidationRow): ValidationRow {
    const errors: string[] = [];
    if (!row.telephone) {
      errors.push('telephone_vide');
    } else if (!this.isValidSenegalPhone(row.telephone)) {
      errors.push('telephone');
    }
    if (!row.montant) {
      errors.push('montant');
    }
    return { ...row, errors };
  }

  private buildRecapitulatif(): void {
    const validRows = this.validationRows.filter(r => !r.errors?.length);

    let totalAmount = 0;
    for (const row of validRows) {
      totalAmount += this.parseMontant(row.montant);
    }

    const opMap = new Map<string, { count: number; total: number }>();
    for (const row of validRows) {
      const op   = row.operateur || 'Inconnu';
      const prev = opMap.get(op) ?? { count: 0, total: 0 };
      prev.count++;
      prev.total += this.parseMontant(row.montant);
      opMap.set(op, prev);
    }

    const repartition = Array.from(opMap.entries()).map(([nom, data]) => ({
      nom,
      beneficiaires: data.count,
      montant:       this.formatAmount(data.total),
      pourcentage:   validRows.length > 0
        ? Math.round((data.count / validRows.length) * 100)
        : 0,
      couleur: this.OPERATEUR_COLORS[nom.toLowerCase()] ?? '#6366f1',
    }));

    this.recapitulatif = {
      fichier:       this.selectedFile?.name ?? '',
      beneficiaires: validRows.length,
      montantTotal:  this.formatAmount(totalAmount),
      operateurs:    opMap.size,
      repartition,
      approbateurs:  this.recapitulatif.approbateurs,
    };
  }

  private parseMontant(montant: string): number {
    const cleaned = montant
      .replace(/\s/g, '')
      .replace('XOF', '')
      .replace(/\./g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  private formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR') + ' XOF';
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\+\(\)\.]/g, '');
  }

  private toWallet(operateur: string): Wallet {
    return this.WALLET_MAP[operateur.toLowerCase().trim()] ?? Wallet.Wave;
  }

  onSoumettre(): void {
    const validRows = this.validationRows.filter(r => !r.errors?.length);
    if (!validRows.length || this.isSubmitting) return;

    const inputs: BulkPaymentInput[] = validRows.map(row => ({
      firstName:   row.prenom,
      lastName:    row.nom,
      phoneNumber: this.normalizePhone(row.telephone),
      amount:      this.parseMontant(row.montant),
      ...(row.motif && { reason: row.motif }),
      wallet:      this.toWallet(row.operateur),
    }));

    this.isSubmitting = true;
    this.createBulkPaymentOrderGQL.mutate({ inputs }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.showErrorSnackBar(4000, 'Erreur lors de la soumission de l\'ordre de paiement.');
      },
    });
  }
}
