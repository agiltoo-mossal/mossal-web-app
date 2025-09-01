import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { dateToString } from 'src/app/shared/utils/time';
import {
  CategorySociopro,
  FetchCategorySocioprosGQL,
  FetchOrganizationCollaboratorGQL,
  InviteAdminGQL,
  InviteCollaboratorGQL,
  LockUserGQL,
  UnlockUserGQL,
  UpdateCollaboratorGQL,
  User,
  Wallet,
} from 'src/graphql/generated';

interface FinancialInstitution {
  id: string;
  name: string;
}

interface InterestRate {
  value: number;
  label: string;
}

interface SalaryPercentage {
  value: number;
  label: string;
}

interface PSP {
  id: string;
  name: string;
}

interface SelectedFiles {
  ninea?: File;
  registre?: File;
  domiciliation?: File;
}
@Component({
  selector: 'app-form-society',
  templateUrl: './form-society.component.html',
  styleUrls: ['./form-society.component.scss'],
})
export class FormSocietyComponent implements OnInit, OnChanges {
  @Input() formType: string;
  formText: string = '';
  societyForm: FormGroup;
  society: User;
  @Input() societyId: string;
  isLoading: boolean = false;
  phoneNumberExists: boolean = false;
  companyPhoneExists: boolean = false;
  adminPhoneExists: boolean = false;
  accountNumberExists: boolean = false;
  adminEmailExists: boolean = false;
  companyNameExists: boolean = false;

  title = 'Ajout d\'une nouvelle société';
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];

  // Données pour les listes déroulantes
  financialInstitutions: FinancialInstitution[] = [
    { id: '1', name: 'CBAO Groupe Attijariwafa Bank' },
    { id: '2', name: 'Banque de l\'Habitat du Sénégal' },
    { id: '3', name: 'Ecobank Sénégal' },
    { id: '4', name: 'Société Générale de Banques au Sénégal' },
    { id: '5', name: 'UBA Sénégal' },
    { id: '6', name: 'Banque Atlantique' },
    { id: '7', name: 'BICIS' },
    { id: '8', name: 'CITIBANK' }
  ];

  psps: PSP[] = [
    { id: '1', name: 'Intouch' },
    { id: '2', name: 'Paydunya' },
    { id: '3', name: 'Cofina' }
  ];

  interestRates: InterestRate[] = [
    { value: 0, label: '0%' },
    { value: 2, label: '2%' },
    { value: 5, label: '5%' },
    { value: 7, label: '7%' },
    { value: 10, label: '10%' },
    { value: 12, label: '12%' },
    { value: 15, label: '15%' }
  ];

  salaryPercentages: SalaryPercentage[] = [
    { value: 10, label: '10%' },
    { value: 20, label: '20%' },
    { value: 30, label: '30%' },
    { value: 40, label: '40%' },
    { value: 50, label: '50%' },
    { value: 60, label: '60%' },
    { value: 70, label: '70%' },
    { value: 80, label: '80%' },
    { value: 90, label: '90%' },
    { value: 100, label: '100%' }
  ];

  constructor(
    private fb: FormBuilder,
    private inviteCollaboratorGQL: InviteCollaboratorGQL,
    private router: Router,
    private snackBarService: SnackBarService,
    private fetchOrganizationCollaboratorGQL: FetchOrganizationCollaboratorGQL,
    private updateCollaboratorGQL: UpdateCollaboratorGQL,
    private searchService: SearchService,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private listCategorieGQL: FetchCategorySocioprosGQL
  ) {
    this.societyForm = this.fb.group({
      // Section Informations de la société
      companyName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      companyPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+221(78|77|76|70|75)\d{7}$/)
        ]
      ],
      accountNumber: ['', Validators.required],
      financialInstitution: ['', Validators.required],
      // psp: ['', Validators.required], // PSP obligatoire


      // Section Informations du super admin
      adminFirstName: ['', Validators.required],
      adminLastName: ['', Validators.required],
      adminFunction: ['', Validators.required],
      adminPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+221(78|77|76|70|75)\d{7}$/)
        ]
      ],
      adminEmail: ['', [Validators.required, Validators.email]],
      maxAmount: [0, [Validators.required, Validators.min(0)]],
      reimbursementDate: ['', Validators.required],
      interestRate: ['', Validators.required],
      maxSalaryPercent: ['', Validators.required]
    });
  }

  get companyPhone() {
    return this.societyForm.controls['companyPhone'];
  }

  get adminPhone() {
    return this.societyForm.controls['adminPhone'];
  }

  get maxAmount() {
    return this.societyForm.get('maxAmount');
  }

  // Méthode pour gérer la sélection des fichiers PDF
  // onFileSelect(event: any, fileType: 'ninea' | 'registre' | 'domiciliation') {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Vérifier que c'est un PDF
  //     if (file.type !== 'application/pdf') {
  //       this.snackBarService.showErrorSnackBar(5000,'Veuillez sélectionner un fichier PDF');
  //       return;
  //     }
      
  //     // Vérifier la taille du fichier (max 5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       this.snackBarService.showErrorSnackBar(5000,'Le fichier ne doit pas dépasser 5MB');
  //       return;
  //     }
      
  //     this.selectedFiles[fileType] = file;
  //     console.log(`Fichier ${fileType} sélectionné:`, file.name);
  //   }
  // }

  ngOnInit(): void {
    this.formText =
      this.formType == 'edit'
        ? 'Modifier les informations de la société'
        : 'Création nouvelle société';

    this.listCategorieGQL
      .fetch({
        queryConfig: {
          limit: 10,
        },
      })
      .subscribe((result) => {
        this.categories = result.data.fetchCategorySociopros.results;
        console.log('list', this.categories);
      });

    // this.initSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.getSociety();
    if (this.formType == 'edit') {
      this.societyForm.controls['adminEmail'].disable();
    }
  }

  // Méthode pour soumettre le formulaire
  submitForm() {
    if (this.societyForm.invalid || this.isLoading || this.hasErrors) {
      this.societyForm.markAllAsTouched();
      return;
    }
    if (this.societyId) {
      this.edit();
      return;
    }
    this.isLoading = true;
    const formValue = this.societyForm.getRawValue();

    // Préparer les données pour l'API
    const societyData = {
      companyName: formValue.companyName,
      address: formValue.address,
      city: formValue.city,
      companyPhone: formValue.companyPhone,
      accountNumber: formValue.accountNumber,
      financialInstitutionId: formValue.financialInstitution,
      // pspId: formValue.psp,
      // pspId: formValue.psp,
      adminFirstName: formValue.adminFirstName,
      adminLastName: formValue.adminLastName,
      adminFunction: formValue.adminFunction,
      adminPhone: formValue.adminPhone,
      adminEmail: formValue.adminEmail,
      maxAmount: Number(formValue.maxAmount),
      reimbursementDate: formValue.reimbursementDate,
      interestRate: Number(formValue.interestRate),
      maxSalaryPercent: Number(formValue.maxSalaryPercent)
    };
  }

  edit() {
    if (this.societyForm.invalid || this.isLoading) {
      this.societyForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const formValue = this.societyForm.getRawValue();

    const societyData = {
      companyName: formValue.companyName,
      address: formValue.address,
      city: formValue.city,
      companyPhone: formValue.companyPhone,
      accountNumber: formValue.accountNumber,
      financialInstitutionId: formValue.financialInstitution,
      // pspId: formValue.psp,
      adminFirstName: formValue.adminFirstName,
      adminLastName: formValue.adminLastName,
      adminFunction: formValue.adminFunction,
      adminPhone: formValue.adminPhone,
      maxAmount: Number(formValue.maxAmount),
      reimbursementDate: formValue.reimbursementDate,
      interestRate: Number(formValue.interestRate),
      maxSalaryPercent: Number(formValue.maxSalaryPercent)
    };

  
  }

 

  checkCompanyPhone() {
    this.societyForm
      .get('companyPhone')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          return this.searchService.phoneNumberExists(
            value,
            false,
            this.societyId
          );
        })
      )
      .subscribe((result) => {
        this.societyForm.controls['companyPhone'].setErrors(null);
        this.societyForm.controls['companyPhone'].updateValueAndValidity();
        this.companyPhoneExists = result;
        if (result) {
          this.societyForm.controls['companyPhone'].setErrors({
            phoneNumberExists: true,
          });
        }
      });
  }

  checkAdminPhone() {
    this.societyForm
      .get('adminPhone')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          return this.searchService.phoneNumberExists(
            value,
            false,
            this.societyId
          );
        })
      )
      .subscribe((result) => {
        this.societyForm.controls['adminPhone'].setErrors(null);
        this.societyForm.controls['adminPhone'].updateValueAndValidity();
        this.adminPhoneExists = result;
        if (result) {
          this.societyForm.controls['adminPhone'].setErrors({
            phoneNumberExists: true,
          });
        }
      });
  }

  checkAdminEmail() {
    this.societyForm
      .get('adminEmail')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          return this.searchService.emailExists(
            value,
            false,
            this.societyId
          );
        })
      )
      .subscribe((result) => {
        this.adminEmailExists = result;
        this.societyForm.controls['adminEmail'].setErrors(null);
        this.societyForm.controls['adminEmail'].updateValueAndValidity();

        if (result) {
          this.societyForm.controls['adminEmail'].setErrors({
            emailExists: true,
          });
        }
      });
  }


  get hasErrors() {
    return (
      this.companyPhoneExists ||
      this.adminPhoneExists ||
      this.adminEmailExists ||
      this.accountNumberExists ||
      this.companyNameExists
    );
  }


}