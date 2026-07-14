import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { CreateBulkPaymentOrderGQL, BulkPaymentInput, Wallet } from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { BulkPaymentFileService } from 'src/app/shared/services/bulk-payment-file.service';

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
export class ImportFichierComponent implements OnInit {

  selectedFile: File | null = null;
  label = '';
  isSaving = false;
  editingIndex: number | null = null;

  readonly OPERATEURS = ['Wave', 'Orange Money'];

  private readonly ERROR_LABELS: Record<string, string> = {
    nom_vide:        'Nom vide',
    prenom_vide:     'Prénom vide',
    motif_vide:      'Motif vide',
    operateur_vide:  'Opérateur vide',
    telephone_vide:  'Téléphone vide',
    telephone:       'N° invalide',
    montant_vide:    'Montant vide',
    montant_negatif: 'Montant invalide',
  };

  errorLabels(row: ValidationRow): string[] {
    return (row.errors ?? []).map(e => this.ERROR_LABELS[e] ?? e);
  }

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private createBulkPaymentOrderGQL: CreateBulkPaymentOrderGQL,
    private snackBar: SnackBarService,
    private bulkPaymentFileService: BulkPaymentFileService,
  ) {}

  ngOnInit(): void {
    const preselectedFile = this.bulkPaymentFileService.take();
    if (preselectedFile) {
      this.processFile(preselectedFile);
    }
  }

  get errorCount(): number {
    return this.validationRows.filter(r => r.errors && r.errors.length > 0).length;
  }

  processFile(file: File): void {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!this.ACCEPTED_EXTENSIONS.includes(ext)) {
      this.snackBar.showErrorSnackBar(4000, 'Format non supporté. Veuillez sélectionner un fichier .xlsx ou .xls');
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }
    this.selectedFile = file;
    this.parseExcelFile(file);
  }

  onReimporter(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
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
          this.snackBar.showErrorSnackBar(4000, 'Le fichier est vide. Veuillez ajouter au moins une ligne.');
          this.router.navigate(['../'], { relativeTo: this.route });
          return;
        }

        this.validationRows = rawRows.map(raw => this.mapRow(raw));
      } catch (err) {
        console.error('Erreur lecture Excel:', err);
        this.snackBar.showErrorSnackBar(4000, 'Impossible de lire le fichier. Vérifiez qu\'il s\'agit bien d\'un fichier Excel valide.');
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    };

    reader.onerror = () => {
      this.snackBar.showErrorSnackBar(4000, 'Erreur lors de la lecture du fichier.');
      this.router.navigate(['../'], { relativeTo: this.route });
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
    const motif     = get('motif');
    const operateur = get('operateur');

    const rawMontant = get('montant');
    const amount     = this.parseMontant(rawMontant);
    const montant    = amount > 0 ? this.formatMontant(amount) : rawMontant;

    return this.revalidateRow({ nom, prenom, telephone, montant, motif, operateur });
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
    if (/^(77|78|75|76|70)\d{7}$/.test(digits)) return true;
    if (/^221(77|78|75|76|70)\d{7}$/.test(digits)) return true;
    return false;
  }

  onSaveRow(): void {
    if (this.editingIndex !== null) {
      this.validationRows[this.editingIndex] =
        this.revalidateRow(this.validationRows[this.editingIndex]);
    }
    this.editingIndex = null;
  }

  onRowBlur(index: number): void {
    const row = { ...this.validationRows[index] };
    const amount = this.parseMontant(row.montant);
    if (amount > 0) {
      row.montant = this.formatMontant(amount);
    }
    if (row.telephone?.trim()) {
      row.telephone = this.formatPhone(row.telephone);
    }
    this.validationRows[index] = this.revalidateRow(row);
  }

  onEditRow(index: number): void {
    this.editingIndex = index;
  }

  onDeleteRow(index: number): void {
    this.validationRows.splice(index, 1);
  }

  private revalidateRow(row: ValidationRow): ValidationRow {
    const errors: string[] = [];
    if (!row.nom?.trim())       errors.push('nom_vide');
    if (!row.prenom?.trim())    errors.push('prenom_vide');
    if (!row.operateur?.trim()) errors.push('operateur_vide');
    if (!row.telephone?.trim()) {
      errors.push('telephone_vide');
    } else if (!this.isValidSenegalPhone(row.telephone)) {
      errors.push('telephone');
    }
    const amount = this.parseMontant(row.montant);
    if (!row.montant?.trim()) {
      errors.push('montant_vide');
    } else if (amount <= 0) {
      errors.push('montant_negatif');
    }
    return { ...row, errors };
  }

  private parseMontant(montant: string): number {
    const cleaned = montant
      .replace(/\s/g, '')
      .replace(/XOF/gi, '')
      .replace(/F$/i, '')
      .replace(/\./g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  private formatMontant(amount: number): string {
    return 'XOF ' + Math.round(amount);
  }

  private formatPhone(phone: string): string {
    const digits = phone.replace(/[\s\-\+\(\)\.]/g, '');
    if (digits.length === 9) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
    }
    if (digits.length === 12 && digits.startsWith('221')) {
      const local = digits.slice(3);
      return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7)}`;
    }
    return phone;
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\+\(\)\.]/g, '');
  }

  private toWallet(operateur: string): Wallet {
    return this.WALLET_MAP[operateur.toLowerCase().trim()] ?? Wallet.Wave;
  }

  private buildPaymentInputs(): BulkPaymentInput[] {
    return this.validationRows
      .filter(r => !r.errors?.length)
      .map(row => ({
        firstName:   row.prenom,
        lastName:    row.nom,
        phoneNumber: this.normalizePhone(row.telephone),
        amount:      this.parseMontant(row.montant),
        wallet:      this.toWallet(row.operateur),
      }));
  }

  onEnregistrer(): void {
    const inputs = this.buildPaymentInputs();
    if (!inputs.length || this.isSaving) return;

    this.isSaving = true;
    this.createBulkPaymentOrderGQL.mutate({ inputs, label: this.label, isDraft: true, type: 'FILE_IMPORT' }).subscribe({
      next: ({ data }) => {
        this.isSaving = false;
        const orderId = data?.createBulkPaymentOrder?.id;
        if (orderId) {
          this.router.navigate(['/dashboard/organization/payments/manual'], {
            queryParams: { orderId, recap: 'true' },
          });
        } else {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.showErrorSnackBar(4000, 'Erreur lors de l\'enregistrement du brouillon.');
      },
    });
  }
}
