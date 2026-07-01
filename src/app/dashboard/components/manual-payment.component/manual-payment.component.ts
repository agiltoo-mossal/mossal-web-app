import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BulkPaymentInput, CreateBulkPaymentOrderGQL, Wallet } from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

interface BeneficiaryForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  amount: number;
  reason: string;
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
  @ViewChild('labelInput') labelInputRef!: ElementRef<HTMLInputElement>;


  currentStep = 1;
  editingIndex: number | null = null;
  isSubmitting = false;
  paymentLabel: string = '';
  isEditingLabel: boolean = false;

  readonly walletOptions: { label: string; value: Wallet }[] = [
    { label: 'Wave', value: Wallet.Wave },
    { label: 'Orange Money', value: Wallet.OrangeMoney },
  ];

  form: BeneficiaryForm = this.emptyForm();

  beneficiaries: BeneficiaryForm[] = [];
  orderSummary: OrderSummary | null = null;
approvalSteps: ApprovalStep[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private createBulkPaymentOrderGQL: CreateBulkPaymentOrderGQL,
    private snackBarService: SnackBarService,
  ) {}

  ngOnInit(): void {}

  private readonly WALLET_COLORS: Record<string, string> = {
    [Wallet.Wave]:        '#06b6d4',
    [Wallet.OrangeMoney]: '#f97316',
  };

  get totalAmount(): number {
    return this.beneficiaries.reduce((sum, b) => sum + (b.amount || 0), 0);
  }

  get recapRepartition(): { nom: string; beneficiaires: number; montant: number; pourcentage: number; couleur: string }[] {
    const map = new Map<string, { count: number; total: number }>();
    for (const b of this.beneficiaries) {
      const key = b.wallet as string;
      const prev = map.get(key) ?? { count: 0, total: 0 };
      map.set(key, { count: prev.count + 1, total: prev.total + (b.amount || 0) });
    }
    const total = this.beneficiaries.length;
    return Array.from(map.entries()).map(([wallet, data]) => ({
      nom:           this.walletOptions.find(o => o.value === wallet)?.label ?? wallet,
      beneficiaires: data.count,
      montant:       data.total,
      pourcentage:   total > 0 ? Math.round((data.count / total) * 100) : 0,
      couleur:       this.WALLET_COLORS[wallet] ?? '#6366f1',
    }));
  }

    focusLabelInput(): void {
        this.labelInputRef.nativeElement.focus();
        this.labelInputRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
s
  deleteBeneficiary(index: number): void {
    this.beneficiaries.splice(index, 1);
  }

 
  clearList(): void {
    if (confirm('Voulez-vous vraiment vider la liste des bénéficiaires ?')) {
      this.beneficiaries = [];
    }
  }

  goToRecap(): void {
    if (this.beneficiaries.length === 0|| !this.paymentLabel.trim()) return;
    this.currentStep = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitOrder(): void {
    this.isSubmitting = true;

    const inputs: BulkPaymentInput[] = this.beneficiaries.map((b) => ({
      firstName: b.firstName,
      lastName: b.lastName,
      phoneNumber: b.phoneNumber,
      amount: b.amount,
      reason: b.reason || undefined,
      wallet: b.wallet as Wallet,
    }));

    this.createBulkPaymentOrderGQL.mutate({ inputs }).subscribe({
      next: () => {
        this.isSubmitting = false;


// TODO: remplacer par les vraies données issues de `result.data` une fois le backend prêt
      this.orderSummary = {
        libelle: this.paymentLabel,
        nombreBeneficiaires: this.beneficiaries.length,
        montantTotal: this.totalAmount,
        operateurs: this.recapRepartition.length,
        dateSoumission: new Date().toLocaleString('fr-FR'),
      };

      this.approvalSteps = [
        {
          niveau: 1,
          approbateurNom: 'Khadija Sarr',
          approbateurRole: 'Approbateur N°1',
          statut: 'en_attente',
          dateNotification: new Date().toLocaleDateString('fr-FR'),
        },
        {
          niveau: 2,
          approbateurNom: 'Mata Sarr',
          approbateurRole: 'Approbateur N°2',
          statut: 'en_attente',
        },
      ];
        
        this.currentStep = 3;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBarService.showErrorSnackBar(4000, 'Erreur lors de la validation!');
      },
    });
  }

relancerApprobateurs(): void {
  // TODO: appeler la mutation de relance une fois définie côté backend
  this.snackBarService.showSuccessSnackBar(3000, 'Notification envoyée aux approbateurs.');
}

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }

  backToHome(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private emptyForm(): BeneficiaryForm {
    return { firstName: '', lastName: '', phoneNumber: '', amount: null, reason: '', wallet: '' };
  }
}
