import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-manual-payment',
  templateUrl: './manual-payment.component.html',
  styleUrls: ['./manual-payment.component.scss']
})
export class ManualPaymentComponent implements OnInit {

  currentStep = 1;
  editingIndex: number | null = null;
  isSubmitting = false;

  readonly walletOptions: { label: string; value: Wallet }[] = [
    { label: 'Wave', value: Wallet.Wave },
    { label: 'Orange Money', value: Wallet.OrangeMoney },
  ];

  form: BeneficiaryForm = this.emptyForm();

  beneficiaries: BeneficiaryForm[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private createBulkPaymentOrderGQL: CreateBulkPaymentOrderGQL,
    private snackBarService: SnackBarService,
  ) {}

  ngOnInit(): void {}

  get totalAmount(): number {
    return this.beneficiaries.reduce((sum, b) => sum + (b.amount || 0), 0);
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

  goToRecap(): void {
    if (this.beneficiaries.length === 0) return;
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
        this.currentStep = 3;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBarService.showErrorSnackBar(4000, 'Erreur lors de la validation!');
      },
    });
  }

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['../payments'], { relativeTo: this.route });
    }
  }

  backToHome(): void {
    this.router.navigate(['../payments'], { relativeTo: this.route });
  }

  private emptyForm(): BeneficiaryForm {
    return { firstName: '', lastName: '', phoneNumber: '', amount: null, reason: '', wallet: '' };
  }
}
