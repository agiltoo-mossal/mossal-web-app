import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Beneficiaire {
  prenom: string;
  nom: string;
  telephone: string;
  montant: number;
  motif: string;
  operateur: string;
}

@Component({
  selector: 'app-manual-payment',
  templateUrl: './manual-payment.component.html',
  styleUrls: ['./manual-payment.component.scss']
})
export class ManualPaymentComponent implements OnInit {

  currentStep = 1;

  form: Beneficiaire = {
    prenom: '',
    nom: '',
    telephone: '',
    montant: 0,
    motif: '',
    operateur: ''
  };

  beneficiaires: Beneficiaire[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  get totalMontant(): number {
    return this.beneficiaires.reduce((sum, b) => sum + (b.montant || 0), 0);
  }

  isFormValid(): boolean {
    return !!(
      this.form.prenom.trim() &&
      this.form.nom.trim() &&
      this.form.telephone.trim() &&
      this.form.montant > 0 &&
      this.form.motif.trim() &&
      this.form.operateur
    );
  }


    ajouterBeneficiaire(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched(); 
      return;
    }

    this.beneficiaires.push({ ...this.form });

    // Réinitialiser le formulaire
    form.resetForm();
    this.form = {
      prenom: '',
      nom: '',
      telephone: '',
      montant: null,
      motif: '',
      operateur: ''
    };
  }

  ajouterAutre(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  supprimerBeneficiaire(index: number): void {
    this.beneficiaires.splice(index, 1);
  }

  viderListe(): void {
    if (confirm('Voulez-vous vraiment vider la liste des bénéficiaires ?')) {
      this.beneficiaires = [];
    }
  }

  resetForm(): void {
    this.form = {
      prenom: '',
      nom: '',
      telephone: '',
      montant: 0,
      motif: '',
      operateur: ''
    };
  }

  passerRecap(): void {
    if (this.beneficiaires.length === 0) return;
    this.currentStep = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  passerValidation(): void {
    this.currentStep = 3;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  retour(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['../payments'], { relativeTo: this.route });
    }
  }

  retourAccueil(): void {
    this.router.navigate(['../payments'], { relativeTo: this.route });
  }
}