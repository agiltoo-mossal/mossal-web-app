import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  BulkPaymentInput,
  CreateBulkPaymentOrderGQL,
  FetchApprovalFlowGQL,
  FetchCurrentAdminGQL,
  Organization,
  Wallet,
} from 'src/graphql/generated';
import { FetchBulkPaymentOrderByIdGQL, SubmitBulkPaymentOrderGQL, UpdateBulkPaymentOrderGQL } from 'src/graphql/bulk-payment-extended';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

interface WorkflowApprobateur {
  nom: string;
  role: string;
  statut: string;
  avatar: string;
}

interface BeneficiaryForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  amount: string;
  wallet: Wallet | '';
}

interface ApprovalStep {
  niveau: number;
  approbateurNom: string;
  approbateurRole: string;
  statut: 'en_attente' | 'valide' | 'rejete';
  dateNotification?: string;
}

interface OrderSummary {
  libelle: string;
  nombreBeneficiaires: number;
  montantTotal: number;
  operateurs: number;
  dateSoumission: string;
}

@Component({
  selector: 'app-manual-payment',
  templateUrl: './manual-payment.component.html',
  styleUrls: ['./manual-payment.component.scss']
})
export class ManualPaymentComponent implements OnInit {
  @ViewChild('labelInput') labelInputRef: ElementRef<HTMLInputElement>;

  currentStep = 1;
  isLoadingOrder = false;
  editingIndex: number | null = null;
  isSubmitting = false;
  isSavingDraft = false;
  draftOrderId: string | null = null;

  // Solde de l'organisation, utilisé pour l'avertissement de solde insuffisant
  organization: Organization | null = null;

  readonly walletOptions: { label: string; value: Wallet }[] = [
    { label: 'Wave', value: Wallet.Wave },
    { label: 'Orange Money', value: Wallet.OrangeMoney },
  ];

  form: BeneficiaryForm = this.emptyForm();

  label = '';
  isEditingLabel = false;
  beneficiaries: BeneficiaryForm[] = [];
  approvalFlowApprovers: WorkflowApprobateur[] = [];
  orderSummary: OrderSummary | null = null;
  approvalSteps: ApprovalStep[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private createBulkPaymentOrderGQL: CreateBulkPaymentOrderGQL,
    private fetchApprovalFlowGQL: FetchApprovalFlowGQL,
    private fetchBulkPaymentOrderByIdGQL: FetchBulkPaymentOrderByIdGQL,
    private submitBulkPaymentOrderGQL: SubmitBulkPaymentOrderGQL,
    private updateBulkPaymentOrderGQL: UpdateBulkPaymentOrderGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.fetchApprovalFlowGQL.fetch({}, { fetchPolicy: 'network-only' }).subscribe({
      next: ({ data }) => {
        this.approvalFlowApprovers = [...(data.fetchApprovalFlow?.approvalFlow ?? [])]
          .filter((item) => !!item.approverId)
          .sort((a, b) => a.level - b.level)
          .map((item) => ({
            nom: `${item.approverFirstName ?? ''} ${item.approverLastName ?? ''}`.trim(),
            role: `Approbateur ${item.level}`,
            statut: 'En attente',
            avatar: (item.approverFirstName?.[0] ?? '').toUpperCase() + (item.approverLastName?.[0] ?? '').toUpperCase(),
          }));
      },
    });

    this.loadOrganizationBalance();

    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.draftOrderId = orderId;
      this.currentStep = this.route.snapshot.queryParamMap.get('recap') === 'true' ? 2 : 1;
      this.isLoadingOrder = true;
      this.fetchBulkPaymentOrderByIdGQL.fetch({ id: orderId }, { fetchPolicy: 'network-only' }).subscribe({
        next: ({ data }) => {
          const order = data?.fetchBulkPaymentOrderById;
          if (!order) return;
          this.label = order.label;
          this.beneficiaries = (order.payments ?? []).map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            phoneNumber: this.formatPhoneValue(p.phoneNumber),
            amount: p.amount.toLocaleString('fr-FR').replace(/ /g, ' '),
            wallet: p.wallet as Wallet,
          }));
          this.isLoadingOrder = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => {
          this.isLoadingOrder = false;
          this.snackBarService.showErrorSnackBar(4000, 'Impossible de charger le brouillon.');
        },
      });
    }
  }

  private loadOrganizationBalance(): void {
    this.fetchCurrentAdminGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe({
      next: (result) => {
        if (result.data) {
          this.organization = result.data.fetchCurrentAdmin.organization as Organization;
        }
      },
      // Si l'appel échoue, on n'affiche pas l'avertissement plutôt que de bloquer le parcours.
      error: () => { this.organization = null; },
    });
  }

  /**
   * Scénario Gherkin "Solde insuffisant pour un nouvel ordre de paiement":
   * on compare le solde actuel de l'organisation au montant total de l'ordre en cours.
   * Retourne false tant que le solde n'est pas encore chargé (on n'affiche rien par défaut).
   */
  get isBalanceInsufficient(): boolean {
    if (!this.organization) return false;
    return this.organization.balance < this.totalAmount;
  }
  
  get balanceAfterExecution(): number {
    if (!this.organization) return 0;
    return this.organization.balance - this.totalAmount;
  }

  private formatPhoneValue(phone: string): string {
    const d = phone.replace(/\D/g, '').slice(0, 9);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
    if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
    return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
  }

  private readonly WALLET_COLORS: Record<string, string> = {
    [Wallet.Wave]: '#06b6d4',
    [Wallet.OrangeMoney]: '#f97316',
  };

  private parseAmount(val: string): number {
    return parseInt(val?.replace(/\s/g, '') || '0', 10) || 0;
  }

  get totalAmount(): number {
    return this.beneficiaries.reduce((sum, b) => sum + this.parseAmount(b.amount), 0);
  }

  get recapRepartition(): { nom: string; beneficiaires: number; montant: number; pourcentage: number; couleur: string }[] {
    const map = new Map<string, { count: number; total: number }>();
    for (const b of this.beneficiaries) {
      const key = b.wallet as string;
      const prev = map.get(key) ?? { count: 0, total: 0 };
      map.set(key, { count: prev.count + 1, total: prev.total + this.parseAmount(b.amount) });
    }
    const total = this.beneficiaries.length;
    return Array.from(map.entries()).map(([wallet, data]) => ({
      nom: this.walletOptions.find(o => o.value === wallet)?.label ?? wallet,
      beneficiaires: data.count,
      montant: data.total,
      pourcentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      couleur: this.WALLET_COLORS[wallet] ?? '#6366f1',
    }));
  }

  addBeneficiary(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const beneficiary = { ...this.form };

    if (this.editingIndex !== null) {
      this.beneficiaries[this.editingIndex] = beneficiary;
      this.editingIndex = null;
    } else {
      this.beneficiaries.push(beneficiary);
    }

    form.resetForm();
    this.form = this.emptyForm();

  }

  editBeneficiary(index: number): void {
    this.form = { ...this.beneficiaries[index] };
    this.editingIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
  }


  clearList(): void {
    if (confirm('Voulez-vous vraiment vider la liste des bénéficiaires ?')) {
      this.beneficiaries = [];
    }
  }

  focusLabel(): void {
    this.labelInputRef?.nativeElement?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToRecap(): void {
    if (this.beneficiaries.length === 0) return;
    this.isSavingDraft = true;

    const onSuccess = () => {
      this.isSavingDraft = false;
      this.currentStep = 2;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const onError = () => {
      this.isSavingDraft = false;
      this.currentStep = 2;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (this.draftOrderId) {
      this.updateBulkPaymentOrderGQL
        .mutate({ id: this.draftOrderId, inputs: this.buildInputs(), label: this.label })
        .subscribe({ next: onSuccess, error: onError });
    } else {
      this.createBulkPaymentOrderGQL
        .mutate({ inputs: this.buildInputs(), label: this.label, isDraft: true, type: 'MANUAL' })
        .subscribe({
          next: ({ data }) => {
            this.draftOrderId = data?.createBulkPaymentOrder?.id ?? null;
            onSuccess();
          },
          error: onError,
        });
    }
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 9);
    let fmt = digits;
    if (digits.length > 2) fmt = digits.slice(0, 2) + ' ' + digits.slice(2);
    if (digits.length > 5) fmt = digits.slice(0, 2) + ' ' + digits.slice(2, 5) + ' ' + digits.slice(5);
    if (digits.length > 7) fmt = digits.slice(0, 2) + ' ' + digits.slice(2, 5) + ' ' + digits.slice(5, 7) + ' ' + digits.slice(7);
    input.value = fmt;
    this.form.phoneNumber = fmt;
  }

  formatAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    if (!digits) {
      input.value = '';
      this.form.amount = '';
      return;
    }
    const num = parseInt(digits, 10);
    const fmt = num.toLocaleString('fr-FR').replace(/ /g, ' ').replace(/ /g, ' ');
    input.value = fmt;
    this.form.amount = fmt;
  }

  private buildInputs(): BulkPaymentInput[] {
    return this.beneficiaries.map((b) => ({
      firstName: b.firstName,
      lastName: b.lastName,
      phoneNumber: b.phoneNumber.replace(/\s/g, ''),
      amount: this.parseAmount(b.amount),
      wallet: b.wallet as Wallet,
    }));
  }

  submitOrder(): void {
    this.isSubmitting = true;

    const navigateToDetails = (orderId: string) => {
      this.isSubmitting = false;
      this.router.navigate(['/dashboard/payments/details', orderId]);
    };

    const onError = () => {
      this.isSubmitting = false;
      this.snackBarService.showErrorSnackBar(4000, 'Erreur lors de la validation!');
    };

    if (this.draftOrderId) {
      this.submitBulkPaymentOrderGQL.mutate({ id: this.draftOrderId }).subscribe({
        next: () => navigateToDetails(this.draftOrderId!),
        error: onError,
      });
    } else {
      this.createBulkPaymentOrderGQL.mutate({ inputs: this.buildInputs(), label: this.label, isDraft: false, type: 'MANUAL' }).subscribe({
        next: ({ data }) => {
          const id = data?.createBulkPaymentOrder?.id;
          if (id) navigateToDetails(id);
          else onError();
        },
        error: onError,
      });
    }
  }

  relancerApprobateurs(): void {
    // TODO: appeler la mutation de relance une fois définie côté backend
    this.snackBarService.showSuccessSnackBar(3000, 'Notification envoyée aux approbateurs.');
  }

  goBackFromRecap(): void {
    if (this.draftOrderId) {
      this.router.navigate(['..'], { relativeTo: this.route });
    } else {
      this.currentStep = 1;
    }
  }

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }

  backToHome(): void {
    this.router.navigate(['/dashboard/organization/payments']);
  }

  private emptyForm(): BeneficiaryForm {
    return { firstName: '', lastName: '', phoneNumber: '', amount: '', wallet: '' };
  }
}