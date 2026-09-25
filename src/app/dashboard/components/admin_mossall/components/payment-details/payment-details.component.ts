import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { BulkPaymentOrderStatus, BulkPaymentOrderType, FetchBulkPaymentOrderByIdGQL, FetchCurrentAdminGQL, Organization, Wallet } from 'src/graphql/generated';
import { CancelBulkPaymentOrderGQL, RelaunchApproversGQL } from 'src/graphql/bulk-payment-extended';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

export interface Beneficiary {
  lastName: string;
  firstName: string;
  phone: string;
  amount: number;
  operator: string;
}

export interface ApprovalStep {
  level: number;
  firstName: string;
  lastName: string;
  position: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isCurrentLevel: boolean;
  notifiedAt?: Date;
  rejectReason?: string;
}

export interface PaymentOrderDetails {
  label: string;
  beneficiariesCount: number;
  amount: number;
  operatorsCount: number;
  createdAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  type: BulkPaymentOrderType;
  approvals: ApprovalStep[];
  beneficiaries: Beneficiary[];
  rejectedReason?: string;
  lastRelaunchAt?: Date;
}

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  currentStep = 1;
  organization: Organization | null = null;

  payment: PaymentOrderDetails | null = null;
  isLoading = true;
  orderId: string | null = null;

  isBeneficiairesOpen = true;

  isRelaunching = false;
  isCancelling = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fetchBulkPaymentOrderByIdGQL: FetchBulkPaymentOrderByIdGQL,
    private relaunchApproversGQL: RelaunchApproversGQL,
    private cancelBulkPaymentOrderGQL: CancelBulkPaymentOrderGQL,
    private snackBarService: SnackBarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,

  ) { }

  ngOnInit(): void {
    this.loadOrganizationBalance();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      return;
    }
    this.orderId = id;

    this.fetchBulkPaymentOrderByIdGQL
      .fetch({ id }, { fetchPolicy: 'network-only' })
      .subscribe({
        next: (res) => {
          const order = res.data?.fetchBulkPaymentOrderById;
          if (!order) { this.isLoading = false; return; }

          const approvers = order.approvers ?? [];
          const approvals = order.approvals ?? [];

          const lastRelaunchAt = order.lastRelaunchAt ? new Date(order.lastRelaunchAt) : undefined;

          const approvalSteps: ApprovalStep[] = approvers.map((approver, index) => {
            const level = index + 1;
            const approval = approvals.find(a => a.level === level);
            const isCurrentLevel = level === (order.currentApprovalLevel ?? 1);

            let status: 'APPROVED' | 'PENDING' | 'REJECTED';
            if (approval?.approvedAt) {
              status = 'APPROVED';
            } else if (order.status === BulkPaymentOrderStatus.Rejected && level === order.currentApprovalLevel) {
              status = 'REJECTED';
            } else {
              status = 'PENDING';
            }

            return {
              level,
              firstName: approver.firstName,
              lastName: approver.lastName,
              position: approver.position ?? '',
              status,
              isCurrentLevel,
              // Pour le niveau en cours, la date de notification reflète une éventuelle relance.
              notifiedAt: isCurrentLevel && lastRelaunchAt ? lastRelaunchAt : new Date(order.createdAt),
              rejectReason: status === 'REJECTED' ? (order.rejectedReason ?? undefined) : undefined,

            };
          });

          const payments = order.payments ?? [];
          const operators = new Set(payments.map(p => p.wallet)).size;

          const walletLabel: Record<string, string> = {
            [Wallet.Wave]: 'Wave',
            [Wallet.OrangeMoney]: 'Orange Money'
          };

          this.payment = {
            label: order.label,
            beneficiariesCount: payments.length,
            amount: order.totalAmount,
            operatorsCount: operators,
            createdAt: new Date(order.createdAt),
            status: order.status === BulkPaymentOrderStatus.Approved
              ? 'APPROVED'
              : order.status === BulkPaymentOrderStatus.Rejected
                ? 'REJECTED'
                : order.status === BulkPaymentOrderStatus.Cancelled
                  ? 'CANCELLED'
                  : 'PENDING',
            type: order.type ?? BulkPaymentOrderType.Manual,
            approvals: approvalSteps,
            rejectedReason: order.rejectedReason ?? undefined,
            lastRelaunchAt,
            beneficiaries: payments.map(p => ({
              lastName: p.lastName,
              firstName: p.firstName,
              phone: p.phoneNumber,
              amount: p.amount,
              operator: walletLabel[p.wallet] ?? p.wallet,
            })),
          };

          this.isLoading = false;
        },
        error: () => { this.isLoading = false; },
      });
  }

 

  goToHome(): void {
    this.router.navigate(['/dashboard/organization/payments']);
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


  get isPending(): boolean {
    return this.payment?.status === 'PENDING';
  }

  get isApproved(): boolean {
    return this.payment?.status === 'APPROVED';
  }

  get isRejected(): boolean {
    return this.payment?.status === 'REJECTED';
  }

  get lastApprovedApprover(): ApprovalStep | undefined {
    if (!this.payment) return undefined;
    const approved = this.payment.approvals.filter(a => a.status === 'APPROVED');
    return approved.length > 0 ? approved[approved.length - 1] : undefined;
  }

  get currentApproverWaiting(): ApprovalStep | undefined {
    return this.payment?.approvals.find(a => a.status === 'PENDING');
  }

  get rejectedApprover(): ApprovalStep | undefined {
    return this.payment?.approvals.find(a => a.status === 'REJECTED');
  }

  get hasSomeoneApproved(): boolean {
    return !!this.lastApprovedApprover;
  }

  // "Modifier" n'est proposé que tant qu'aucun approbateur n'a encore traité l'ordre :
  // dès qu'un niveau a validé, le circuit est engagé et l'ordre ne peut plus être modifié.
  get isModifiable(): boolean {
    return this.isPending && !this.hasSomeoneApproved;
  }

  get isBalanceInsufficient(): boolean {
    if (!this.organization || !this.payment) return false;
    return this.organization.balance < this.payment.amount;
  }

  get balanceAfterExecution(): number {
    if (!this.organization || !this.payment) return 0;
    return this.organization.balance - this.payment.amount;
  }
  // Nombre d'heures avant de pouvoir relancer à nouveau (0 si la relance est déjà possible).
  get hoursUntilNextRelaunch(): number {
    if (!this.payment?.lastRelaunchAt) return 0;
    const elapsedHours = (Date.now() - this.payment.lastRelaunchAt.getTime()) / (1000 * 60 * 60);
    return Math.max(0, Math.ceil(24 - elapsedHours));
  }

  get canRelaunch(): boolean {
    return this.hoursUntilNextRelaunch === 0;
  }

  relancerApprobateurs(): void {
    if (!this.orderId || !this.canRelaunch || this.isRelaunching) return;
    this.isRelaunching = true;
    this.relaunchApproversGQL.mutate({ id: this.orderId }).subscribe({
      next: ({ data }) => {
        this.isRelaunching = false;
        const relaunchedAt = data?.relaunchApprovers?.lastRelaunchAt
          ? new Date(data.relaunchApprovers.lastRelaunchAt)
          : new Date();
        if (this.payment) {
          this.payment.lastRelaunchAt = relaunchedAt;
          const currentStep = this.payment.approvals.find(a => a.isCurrentLevel);
          if (currentStep) currentStep.notifiedAt = relaunchedAt;
        }
        this.snackBarService.showSuccessSnackBar(4000, 'Les approbateurs ont été relancés avec succès');
      },
      error: (err) => {
        this.isRelaunching = false;
        const message = err?.message?.replace('GraphQL error: ', '') || 'Erreur lors de la relance des approbateurs.';
        this.snackBarService.showErrorSnackBar(4000, message);
      },
    });
  }

  renouvelerPaiement = (): void => {
    if (!this.orderId) return;
    this.router.navigate(['/dashboard/organization/payments/manual'], {
      queryParams: { renewFrom: this.orderId },
    });
  };

  // Les deux modes de création (saisie manuelle / import de fichier) partagent la même
  // table de bénéficiaires modifiable dans manual-payment ; le composant d'import ne sait
  // que traiter un fichier fraîchement déposé et ne peut pas recharger un ordre existant.
  modifierOrdre(): void {
    if (!this.orderId || !this.isModifiable) return;
    this.router.navigate(['/dashboard/organization/payments/manual'], {
      queryParams: { editOrderId: this.orderId },
    });
  }

  annulerOrdre = (): void => {
    if (!this.orderId || !this.isPending || this.isCancelling) return;
    this.isCancelling = true;
    this.cancelBulkPaymentOrderGQL.mutate({ id: this.orderId }).subscribe({
      next: () => {
        this.isCancelling = false;
        this.snackBarService.showSuccessSnackBar(4000, 'Ordre de paiement annulé.');
        this.router.navigate(['/dashboard/organization/payments']);
      },
      error: (err) => {
        this.isCancelling = false;
        const message = err?.message?.replace('GraphQL error: ', '') || 'Erreur lors de l\'annulation de l\'ordre.';
        this.snackBarService.showErrorSnackBar(4000, message);
      },
    });
  };

  toggleBeneficiairesList(): void {
    this.isBeneficiairesOpen = !this.isBeneficiairesOpen;
  }

  telechargerListe(): void {
    if (!this.payment?.beneficiaries?.length) return;

    const STATUT_LABELS: Record<string, string> = {
      APPROVED: 'Validé',
      REJECTED: 'Rejeté',
      PENDING: 'En attente',
    };
    const statutGlobal = STATUT_LABELS[this.payment.status] ?? this.payment.status;

    const rows = [
      ['Nom', 'Prénom', 'Téléphone', 'Montant', 'Opérateur', 'Statut'],
      ...this.payment.beneficiaries.map(b => [b.lastName, b.firstName, b.phone, b.amount, b.operator, statutGlobal]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook: XLSX.WorkBook = { Sheets: { 'Bénéficiaires': worksheet }, SheetNames: ['Bénéficiaires'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Le nom du fichier doit correspondre exactement au libellé de l'ordre.
    const filename = (this.payment.label ?? 'ordre').replace(/[\\/]/g, '-');
    a.download = `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}
