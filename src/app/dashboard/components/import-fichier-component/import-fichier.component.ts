import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { CreateBulkPaymentOrderGQL, BulkPaymentInput, FetchApprovalFlowGQL, Wallet } from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

interface RecapApprobateur {
  nom: string;
  role: string;
  statut: string;
  avatar: string;
}

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

  step: 'upload' | 'validation' | 'recapitulatif' = 'upload';

  selectedFile: File | null = null;
  fileError: string = '';
  isDragging = false;
  isSubmitting = false;
  isSavingDraft = false;
  isEditing = false;

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

  approvalFlowApprovers: RecapApprobateur[] = [];

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
    approbateurs: [] as RecapApprobateur[],
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
    private fetchApprovalFlowGQL: FetchApprovalFlowGQL,
    private snackBar: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.fetchApprovalFlowGQL.fetch({}, { fetchPolicy: 'network-only' }).subscribe({
      next: ({ data }) => {
        this.approvalFlowApprovers = [...(data.fetchApprovalFlow?.approvalFlow ?? [])]
          .sort((a, b) => a.level - b.level)
          .map((item) => ({
            nom: `${item.approverFirstName ?? ''} ${item.approverLastName ?? ''}`.trim(),
            role: `Approbateur ${item.level}`,
            statut: 'En attente',
            avatar: this.getInitials(item.approverFirstName, item.approverLastName),
          }));
      },
    });
  }

  private getInitials(firstName?: string | null, lastName?: string | null): string {
    return (firstName?.[0] ?? '').toUpperCase() + (lastName?.[0] ?? '').toUpperCase();
  }

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
          this.fileError = 'Le fichier est vide. Veuillez ajouter au moins une ligne.';
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

  onRowBlur(index: number): void {
    const row = { ...this.validationRows[index] };
    const amount = this.parseMontant(row.montant);
    if (amount > 0) {
      row.montant = this.formatMontant(amount);
    }
    this.validationRows[index] = this.revalidateRow(row);
  }

  private revalidateRow(row: ValidationRow): ValidationRow {
    const errors: string[] = [];
    if (!row.nom?.trim())       errors.push('nom_vide');
    if (!row.prenom?.trim())    errors.push('prenom_vide');
    if (!row.motif?.trim())     errors.push('motif_vide');
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
      approbateurs:  this.approvalFlowApprovers,
    };
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

  private formatAmount(amount: number): string {
    return 'XOF ' + Math.round(amount);
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
        ...(row.motif && { reason: row.motif }),
        wallet:      this.toWallet(row.operateur),
      }));
  }

  private get fileLabel(): string {
    return this.selectedFile?.name ?? 'Import fichier';
  }

  onSoumettre(): void {
    const inputs = this.buildPaymentInputs();
    if (!inputs.length || this.isSubmitting) return;

    this.isSubmitting = true;
    this.createBulkPaymentOrderGQL.mutate({ inputs, label: this.fileLabel, isDraft: false }).subscribe({
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

  onSaveDraft(): void {
    const inputs = this.buildPaymentInputs();
    if (!inputs.length || this.isSavingDraft) return;

    this.isSavingDraft = true;
    this.createBulkPaymentOrderGQL.mutate({ inputs, label: this.fileLabel, isDraft: true }).subscribe({
      next: () => {
        this.isSavingDraft = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: () => {
        this.isSavingDraft = false;
        this.snackBar.showErrorSnackBar(4000, 'Erreur lors de l\'enregistrement du brouillon.');
      },
    });
  }
}
