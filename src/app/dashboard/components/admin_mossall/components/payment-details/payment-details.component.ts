import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  notifiedAt?: Date;
  rejectReason?: string;
}

export interface PaymentOrderDetails {
  label: string;
  beneficiariesCount: number;
  amount: number;
  operatorsCount: number;
  createdAt: Date;
  status: 'PENDING' | 'VALIDATED' | 'REJECTED';
  approvals: ApprovalStep[];
  beneficiaries: Beneficiary[];
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

  isBeneficiairesOpen = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const status = this.route.snapshot.queryParamMap.get('status') ?? 'PENDING';
    setTimeout(() => {
      this.payment = this.buildMock(status as PaymentOrderDetails['status']);
      this.isLoading = false;
    }, 300);
  }

  goToHome(): void {
    this.router.navigate(['/dashboard/organization/payments']);
  }

  private buildMock(status: PaymentOrderDetails['status']): PaymentOrderDetails {
    const mockBeneficiaries: Beneficiary[] = Array.from({ length: 8 }, (_, i) => ({
      lastName: 'Diop',
      firstName: 'Laurent',
      phone: '77 700 77 77',
      amount: 120000,
      operator: i % 2 === 0 ? 'Wave' : 'Orange Money',
    }));

    const base: Omit<PaymentOrderDetails, 'status' | 'approvals'> = {
      label: 'Paiement des primes de Juin 2026',
      beneficiariesCount: 42,
      amount: 2320000,
      operatorsCount: 2,
      createdAt: new Date('2026-06-12T10:45:00'),
      beneficiaries: mockBeneficiaries,
    };

    const niveau1Approuve: ApprovalStep = {
      level: 1,
      firstName: 'Khadija',
      lastName: 'Sarr',
      position: 'Super Admin',
      status: 'APPROVED',
      notifiedAt: new Date('2026-03-15'),
    };

    if (status === 'PENDING') {
      return {
        ...base,
        status,
        approvals: [
          niveau1Approuve,
          {
            level: 2,
            firstName: 'Maïté',
            lastName: 'Sarr',
            position: 'Rh/Gestionnaire',
            status: 'PENDING',
            notifiedAt: new Date('2026-03-15'),
          },
        ],
      };
    }

    if (status === 'VALIDATED') {
      return {
        ...base,
        status,
        approvals: [
          niveau1Approuve,
          {
            level: 2,
            firstName: 'Maïté',
            lastName: 'Sarr',
            position: 'Rh/Gestionnaire',
            status: 'APPROVED',
            notifiedAt: new Date('2026-03-15'),
          },
        ],
      };
    }

    // REJECTED
    return {
      ...base,
      status,
      approvals: [
        niveau1Approuve,
        {
          level: 2,
          firstName: 'Maïté',
          lastName: 'Sarr',
          position: 'Rh/Gestionnaire',
          status: 'REJECTED',
          notifiedAt: new Date('2026-03-15'),
          rejectReason: 'Le montant dépasse le plafond mensuel autorisé pour ce type de virement.',
        },
      ],
    };
  }

  get isPending(): boolean {
    return this.payment?.status === 'PENDING';
  }

  get isValidated(): boolean {
    return this.payment?.status === 'VALIDATED';
  }

  get isRejected(): boolean {
    return this.payment?.status === 'REJECTED';
  }

  get currentApproverWaiting(): ApprovalStep | undefined {
    return this.payment?.approvals.find(a => a.status === 'PENDING');
  }

  get rejectedApprover(): ApprovalStep | undefined {
    return this.payment?.approvals.find(a => a.status === 'REJECTED');
  }

  relancerApprobateurs(): void {
    console.log('Relance envoyée (mock)');
  }

  renouvelerPaiement(): void {
    console.log('Renouvellement (mock)');
  }

  toggleBeneficiairesList(): void {
    this.isBeneficiairesOpen = !this.isBeneficiairesOpen;
  }

  telechargerListe(): void {
    console.log('Téléchargement (mock)');
  }

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}