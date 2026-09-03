import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BulkPaymentOrderStatus, FetchBulkPaymentOrderByIdGQL, Wallet } from 'src/graphql/generated';

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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvals: ApprovalStep[];
  beneficiaries: Beneficiary[];
  rejectedReason?: string;
}

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  currentStep = 1;

  payment: PaymentOrderDetails | null = null;
  isLoading = true;
  orderId: string | null = null;

  isBeneficiairesOpen = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fetchBulkPaymentOrderByIdGQL: FetchBulkPaymentOrderByIdGQL,
  ) { }

  ngOnInit(): void {
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

          const approvalSteps: ApprovalStep[] = approvers.map((approver, index) => {
            const level = index + 1;
            const approval = approvals.find(a => a.level === level);

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
              isCurrentLevel: level === (order.currentApprovalLevel ?? 1),
              notifiedAt: new Date(order.createdAt),
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
                : 'PENDING',
            approvals: approvalSteps,
            rejectedReason: order.rejectedReason ?? undefined,
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

  relancerApprobateurs(): void {
    console.log('Relance envoyée');
  }

  renouvelerPaiement = (): void => {
    if (!this.orderId) return;
    this.router.navigate(['/dashboard/organization/payments/manual'], {
      queryParams: { renewFrom: this.orderId },
    });
  };

  toggleBeneficiairesList(): void {
    this.isBeneficiairesOpen = !this.isBeneficiairesOpen;
  }

  telechargerListe(): void {
    console.log('Téléchargement');
  }

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}
