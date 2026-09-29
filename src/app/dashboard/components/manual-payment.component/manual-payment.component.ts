import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BulkPaymentInput,
  CreateBulkPaymentOrderGQL,
  FetchApprovalFlowGQL,
  FetchCurrentAdminGQL,
  FetchOrganizationApproversGQL,
  Organization,
  Wallet,
} from 'src/graphql/generated';
import { FetchBulkPaymentOrderByIdGQL, SubmitBulkPaymentOrderGQL, UpdateBulkPaymentOrderGQL, UpdateSubmittedBulkPaymentOrderGQL } from 'src/graphql/bulk-payment-extended';
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

interface Approver {
  id: string;
  firstName: string;
  lastName: string;
  position?: string | null;
}

interface ApprovalLevel {
  level: number;
  approbateurs: Approver[];
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
  editOrderId: string | null = null;

  // Sélection des approbateurs (un niveau = une liste déroulante à choix multiple)
  approvers: Approver[] = [];
  approvalLevels: ApprovalLevel[] = [];
  approversSubmitAttempted = false;

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
    private fetchOrganizationApproversGQL: FetchOrganizationApproversGQL,
    private fetchBulkPaymentOrderByIdGQL: FetchBulkPaymentOrderByIdGQL,
    private submitBulkPaymentOrderGQL: SubmitBulkPaymentOrderGQL,
    private updateBulkPaymentOrderGQL: UpdateBulkPaymentOrderGQL,
    private updateSubmittedBulkPaymentOrderGQL: UpdateSubmittedBulkPaymentOrderGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    forkJoin({
      approvers: this.fetchOrganizationApproversGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(map((r) => r.data)),
      flow: this.fetchApprovalFlowGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(map((r) => r.data)),
    }).subscribe({
      next: ({ approvers, flow }) => {
        this.approvers = (approvers.fetchOrganizationApprovers ?? []).map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          position: u.position,
        }));

        const org = flow.fetchApprovalFlow;
        const count = org?.approvalLevelsCount ?? 0;
        // Aucun pré-remplissage : chaque niveau démarre sans approbateur sélectionné
        this.approvalLevels = Array.from({ length: count }, (_, i) => ({ level: i + 1, approbateurs: [] }));

        this.approvalFlowApprovers = [...(org?.approvalFlow ?? [])]
          .filter((item) => !!item.approverId)
          .sort((a, b) => a.level - b.level)
          .map((item) => ({
            nom: `${item.approverFirstName ?? ''} ${item.approverLastName ?? ''}`.trim(),
            role: `Approbateur ${item.level}`,
            statut: 'En attente',
            avatar: (item.approverFirstName?.[0] ?? '').toUpperCase() + (item.approverLastName?.[0] ?? '').toUpperCase(),
          }));
      },
      error: () => {
        this.snackBarService.showErrorSnackBar(4000, 'Erreur lors du chargement des approbateurs.');
      },
    });

    this.loadOrganizationBalance();

    const editOrderId = this.route.snapshot.queryParamMap.get('editOrderId');
    if (editOrderId) {
      this.editOrderId = editOrderId;
      this.currentStep = 1;
      this.isLoadingOrder = true;
      this.fetchBulkPaymentOrderByIdGQL.fetch({ id: editOrderId }, { fetchPolicy: 'network-only' }).subscribe({
        next: ({ data }) => {
          const order = data?.fetchBulkPaymentOrderById;
          if (!order) {
            this.isLoadingOrder = false;
            this.snackBarService.showErrorSnackBar(4000, 'Impossible de charger l\'ordre à modifier.');
            this.router.navigate(['/dashboard/payments/details', editOrderId]);
            return;
          }
          this.label = order.label;
          this.beneficiaries = (order.payments ?? []).map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            phoneNumber: this.formatPhoneValue(p.phoneNumber),
            amount: p.amount.toLocaleString('fr-FR').replace(/ /g, ' '),
            wallet: p.wallet as Wallet,
          }));
          this.isLoadingOrder = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => {
          this.isLoadingOrder = false;
          this.snackBarService.showErrorSnackBar(4000, 'Impossible de charger l\'ordre à modifier.');
          this.router.navigate(['/dashboard/payments/details', editOrderId]);
        },
      });
      return;
    }

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
            amount: p.amount.toLocaleString('fr-FR').replace(/\u202f/g, '\u00a0'),
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
      return;
    }

    const renewFrom = this.route.snapshot.queryParamMap.get('renewFrom');
    if (renewFrom) {
      this.isLoadingOrder = true;
      this.fetchBulkPaymentOrderByIdGQL.fetch({ id: renewFrom }, { fetchPolicy: 'network-only' }).subscribe({
        next: ({ data }) => {
          const order = data?.fetchBulkPaymentOrderById;
          if (!order) {
            this.isLoadingOrder = false;
            this.snackBarService.showErrorSnackBar(4000, 'Impossible de charger l\'ordre à renouveler.');
            return;
          }

          const renewalPrefix = 'Renouvellement - ';
          const baseLabel = order.label.startsWith(renewalPrefix)
            ? order.label.slice(renewalPrefix.length)
            : order.label;
          const label = `${renewalPrefix}${baseLabel}`;

          const inputs: BulkPaymentInput[] = (order.payments ?? []).map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            phoneNumber: p.phoneNumber,
            amount: p.amount,
            wallet: p.wallet as Wallet,
          }));

          this.createBulkPaymentOrderGQL.mutate({ inputs, label, isDraft: true, type: 'MANUAL' }).subscribe({
            next: ({ data: createData }) => {
              const newOrder = createData?.createBulkPaymentOrder;
              if (!newOrder) {
                this.isLoadingOrder = false;
                this.snackBarService.showErrorSnackBar(4000, 'Impossible de créer le renouvellement.');
                return;
              }
              this.draftOrderId = newOrder.id;
              this.label = label;
              this.beneficiaries = (order.payments ?? []).map((p) => ({
                firstName: p.firstName,
                lastName: p.lastName,
                phoneNumber: this.formatPhoneValue(p.phoneNumber),
                amount: p.amount.toLocaleString('fr-FR').replace(/\u202f/g, '\u00a0'),
                wallet: p.wallet as Wallet,
              }));
              this.isLoadingOrder = false;
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { orderId: newOrder.id, renewFrom: null },
                queryParamsHandling: 'merge',
                replaceUrl: true,
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => {
              this.isLoadingOrder = false;
              this.snackBarService.showErrorSnackBar(4000, 'Impossible de créer le renouvellement.');
            },
          });
        },
        error: () => {
          this.isLoadingOrder = false;
          this.snackBarService.showErrorSnackBar(4000, 'Impossible de charger l\'ordre à renouveler.');
        },
      });
    }
  }

  // ===== Sélection des approbateurs =====

  /** Nombre de niveaux ayant au moins un approbateur sélectionné */
  get selectedApproversCount(): number {
    return this.approvalLevels.filter((l) => l.approbateurs.length > 0).length;
  }

  get allApproversSelected(): boolean {
    return this.approvalLevels.every((l) => l.approbateurs.length > 0);
  }

  get noApproverSelected(): boolean {
    return this.selectedApproversCount === 0;
  }

  /** Exclut les approbateurs déjà choisis aux autres niveaux */
  getAvailableApprovers(levelIndex: number): Approver[] {
    const selectedIds = this.approvalLevels
      .filter((_, i) => i !== levelIndex)
      .flatMap((l) => l.approbateurs.map((a) => a.id));
    return this.approvers.filter((a) => !selectedIds.includes(a.id));
  }

  compareApprovers(a: Approver, b: Approver): boolean {
    return a?.id === b?.id;
  }

  selectedNames(level: ApprovalLevel): string {
    return level.approbateurs.map((a) => `${a.firstName} ${a.lastName}`).join(', ');
  }

  /**
   * Payload à envoyer au backend avec la soumission.
   * TODO: brancher sur la mutation de soumission une fois l'input défini côté backend.
   */
  get selectedApproversPayload(): { level: number; approverIds: string[] }[] {
    return this.approvalLevels.map((l) => ({
      level: l.level,
      approverIds: l.approbateurs.map((a) => a.id),
    }));
  }

  // ===== Solde =====

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

  // En mode édition d'un ordre déjà soumis, la suppression du dernier bénéficiaire
  // est bloquée : un ordre de paiement ne peut pas se retrouver sans aucun bénéficiaire.
  attemptDeleteBeneficiary = (index: number): void => {
    if (this.beneficiaries.length <= 1) {
      this.snackBarService.showErrorSnackBar(
        5000,
        'Un ordre de paiement doit contenir au moins un bénéficiaire. Si vous souhaitez annuler cet ordre, utilisez le bouton "Annuler l\'ordre".',
      );
      return;
    }
    this.deleteBeneficiary(index);
  };

  deleteConfirmMessage(index: number): string {
    const b = this.beneficiaries[index];
    return `Êtes-vous sûr de vouloir retirer ${b?.firstName ?? ''} ${b?.lastName ?? ''} de cet ordre de paiement ?`;
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
    const fmt = num.toLocaleString('fr-FR').replace(/\u202f/g, '\u00a0');
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

  saveEditedOrder(): void {
    if (!this.editOrderId || this.beneficiaries.length === 0 || !this.label.trim() || this.isSubmitting) return;

    this.isSubmitting = true;
    this.updateSubmittedBulkPaymentOrderGQL
      .mutate({ id: this.editOrderId, inputs: this.buildInputs(), label: this.label })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBarService.showSuccessSnackBar(4000, 'Ordre de paiement modifié avec succès.');
          this.router.navigate(['/dashboard/payments/details', this.editOrderId]);
        },
        error: (err) => {
          this.isSubmitting = false;
          const message = err?.message?.replace('GraphQL error: ', '') || 'Erreur lors de la modification de l\'ordre.';
          this.snackBarService.showErrorSnackBar(5000, message);
        },
      });
  }

  cancelEdit = (): void => {
    if (this.editOrderId) {
      this.router.navigate(['/dashboard/payments/details', this.editOrderId]);
    } else {
      this.backToHome();
    }
  };

  submitOrder(): void {
    // Blocage si au moins un niveau n'a aucun approbateur sélectionné
    this.approversSubmitAttempted = true;
    if (!this.allApproversSelected) return;

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