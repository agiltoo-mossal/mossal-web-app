import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  CategorySociopro,
  CreateOrganizationGQL,
  FetchCategorySocioprosGQL,
  FetchOrganizationGQL,
  FetchPaginatedFinancialOrganizationGQL,
  FinancialOrganization,
  OrganisationService,
  Organization,
  UpdateOrganizationGQL,
  User,
} from 'src/graphql/generated';


interface SelectedFiles {
  ninea?: File;
  logo?: File;
}

@Component({
  selector: 'app-form-society',
  templateUrl: './form-society.component.html',
  styleUrls: ['./form-society.component.scss'],
})
export class FormSocietyComponent implements OnInit, OnChanges {
  @Input() formType: string = 'create';
  @Input() societyId: string;
  @ViewChild('logoFileInput') logoFileInput!: ElementRef<HTMLInputElement>;

  formText: string = '';
  societyForm: FormGroup;
  society: Organization;
  isLoading: boolean = false;
  phoneNumberExists: boolean = false;
  companyPhoneExists: boolean = false;
  adminPhoneExists: boolean = false;
  accountNumberExists: boolean = false;
  adminEmailExists: boolean = false;
  companyNameExists: boolean = false;
  selectedFiles: SelectedFiles = {};
  logoPreview: string | null = null;

  title = 'Ajout d\'une nouvelle société';

  psps: Partial<FinancialOrganization & { error: boolean }>[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBarService: SnackBarService,
    private searchService: SearchService,
    private listFinancialOrgGQL: FetchPaginatedFinancialOrganizationGQL,
    private createOrganizationGQL: CreateOrganizationGQL,
    private fetchOrganizationGQL: FetchOrganizationGQL,
    private updateOrganizationGQL: UpdateOrganizationGQL,
  ) {
    this.societyForm = this.fb.group({
      // Section Informations de la société
      companyName: ['', Validators.required],
      address: ['', Validators.required],
      city: [''],
      phone: [
        '',
        [Validators.pattern(/^\+221(78|77|76|70|75)\d{7}$/)]
      ],
      ninea: [''],
      psp: ['', Validators.required],

      balance: [1000000], // Valeur par défaut
      maxDemandeAmount: [1000000], // Valeur par défaut
      fees: [0], // Valeur par défaut
      amountPercent: [75],

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
    });
  }

  ngOnInit(): void {
    this.formText =
      this.formType == 'edit'
        ? 'Modifier les informations de la société'
        : 'Création nouvelle société';

    this.listFinancialOrgGQL
      .fetch({
        queryConfig: {
          limit: 10,
        },
      })
      .subscribe((result) => {
        this.psps = result.data.fetchPaginatedFinancialOrganization.results;
        console.log('list des psp ===>>>>>>>>', this.psps);
      });

    // Initialiser les validations
    if (this.formType !== 'edit') {
      this.initValidations();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getOrganization();
    if (this.formType == 'edit') {
      this.societyForm.controls['adminEmail'].disable();
    }
  }

  getOrganization(): void {
    if (this.societyId) {
      this.title = 'Modification societé';
      this.fetchOrganizationGQL
        .fetch(
          { organizationId: this.societyId },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe({
          next: (result) => {
            this.society = result.data.fetchOrganization as Organization;
            console.log('Organisation récupérée:', this.society);

            // Extraction de l'adresse
            const fullAddress = this.society.postalAddress || '';
            const addressParts = fullAddress.split(',');

            // Mise à jour directe du formulaire avec mapping explicite
            this.societyForm.patchValue({
              // Informations société
              companyName: this.society.name,
              address: addressParts[0]?.trim() || '',
              city: addressParts[1]?.trim() || '',
              phone: this.society.phone || '',
              psp: this.society.financialOrganization.id || '',

              // Informations admin - adapter selon votre structure Organization
              adminFirstName: this.society.user.firstName,
              adminLastName: this.society.user.lastName,
              adminEmail: this.society.rootEmail,
              // Ces champs peuvent ne pas exister dans votre entité Organization
              // Vérifiez votre interface/type Organization
              adminFunction: this.society.user.role || '',
              adminPhone: this.society.phone || '',
            });

            console.log('Valeurs appliquées au formulaire:', this.societyForm.value);
          },
          error: (error) => {
            console.error('Erreur:', error);
            this.snackBarService.showErrorSnackBar(5000, 'Erreur lors du chargement');
          }
        });
    }
  }

  // Déclencher l'input file pour le logo
  triggerLogoUpload(): void {
    this.logoFileInput.nativeElement.click();
  }

  // Gérer la sélection de fichiers
  onFileSelect(event: any, fileType: 'ninea' | 'logo'): void {
    const file = event.target.files[0];
    if (!file) return;

    if (fileType === 'logo') {
      // Validation pour le logo
      if (!file.type.startsWith('image/')) {
        this.snackBarService.showErrorSnackBar(5000, 'Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille du fichier (max 2MB pour les images)
      if (file.size > 2 * 1024 * 1024) {
        this.snackBarService.showErrorSnackBar(5000, 'L\'image ne doit pas dépasser 2MB');
        return;
      }

      this.selectedFiles[fileType] = file;

      // Créer l'aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      console.log('Logo sélectionné:', file.name);
    } else if (fileType === 'ninea') {
      // Validation pour NINEA
      if (file.type !== 'application/pdf') {
        this.snackBarService.showErrorSnackBar(5000, 'Veuillez sélectionner un fichier PDF');
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBarService.showErrorSnackBar(5000, 'Le fichier ne doit pas dépasser 5MB');
        return;
      }

      this.selectedFiles[fileType] = file;
      console.log(`Fichier ${fileType} sélectionné:`, file.name);
    }
  }

  // Supprimer le logo
  removeLogo(): void {
    this.selectedFiles.logo = undefined;
    this.logoPreview = null;
    if (this.logoFileInput) {
      this.logoFileInput.nativeElement.value = '';
    }
  }

  // Initialiser les validations
  initValidations(): void {
    this.checkAdminPhone();
    this.checkAdminEmail();
  }

  submitForm(): void {
    console.log('Heerreeeee: =====>>>>>>>>> ');
    if (this.societyForm.invalid || this.isLoading || this.hasErrors) {
      console.log('this.hasErrors =====>>>>>>>>> ', this.hasErrors);
      console.log('societyForm.invalid: =====>>>>>>>>> ', this.societyForm.invalid);
      console.log('this.isLoading =====>>>>>>>>> ', this.isLoading);
      this.societyForm.markAllAsTouched();

      const controls = this.societyForm.controls;

      Object.keys(controls).forEach(controlName => {
        const control = controls[controlName];
        if (control.errors) {
          console.log(`❌ Erreurs sur "${controlName}":`, control.errors);
        }
      });

      return;
    }

    if (this.societyId) {
      this.edit();
      return;
    }

    this.createOrganization();
  }

  // Créer l'organisation avec la mutation GraphQL
  createOrganization(): void {
    this.isLoading = true;
    const formValue = this.societyForm.getRawValue();

    // Préparer les données pour la mutation
    const organizationInput = {
      name: formValue.companyName,
      rootEmail: formValue.adminEmail,
      rootFirstname: formValue.adminFirstName,
      rootLastname: formValue.adminLastName,
      balance: formValue.balance,
      maxDemandeAmount: formValue.maxDemandeAmount,
      fees: formValue.fees,
      amountPercent: formValue.amountPercent,
      financialOrganizationName: formValue.psp,
      postalAddress: `${formValue.address}, ${formValue.city}`,
      phone: formValue.phone
    };

    // Variables pour la mutation
    const variables: any = {
      organizationInput
    };

    // Ajouter le logo s'il existe
    if (this.selectedFiles.logo) {
      variables.logoFile = this.selectedFiles.logo;
    }

    console.log('Données envoyées:', variables);

    // Exécuter la mutation
    this.createOrganizationGQL.mutate({
      organizationInput: {
        ...organizationInput,
      },
      // context: {
      //   useMultipart: true // Important pour l'upload de fichiers
      // }
    }).subscribe({
      next: (result: any) => {
        console.log('Organisation créée avec succès:', result);
        this.isLoading = false;

        if (result.data?.createOrganization) {
          this.router.navigate(['/dashboard/society']);
          this.snackBarService.showSuccessSnackBar(
            'Société créée avec succès'
          );
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.snackBarService.showErrorSnackBar(
          5000,
          'Une erreur est survenue lors de la création'
        );
        this.isLoading = false;
      }
    });
  }

  edit(): void {
    if (this.societyForm.invalid || this.isLoading) {
      this.societyForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const formValue = this.societyForm.getRawValue();

    // Préparer les données pour la mutation
    const organizationInput = {
      name: formValue.companyName,
      // rootEmail: formValue.adminEmail,
      // rootFirstname: formValue.adminFirstName,
      // rootLastname: formValue.adminLastName,
      balance: formValue.balance,
      maxDemandeAmount: formValue.maxDemandeAmount,
      fees: formValue.fees,
      amountPercent: formValue.amountPercent,
      financialOrganizationName: formValue.psp,
      postalAddress: `${formValue.address}, ${formValue.city}`,
      phone: formValue.phone
    };

    // Variables pour la mutation
    const variables: any = {
      organizationInput
    };

    // Ajouter le logo s'il existe
    if (this.selectedFiles.logo) {
      variables.logoFile = this.selectedFiles.logo;
    }

    console.log('Données envoyées:', variables);
    // Exécuter la mutation
    this.updateOrganizationGQL.mutate({
      organizationId: this.societyId,
      organizationInput: {
        ...organizationInput,
      },
      // context: {
      //   useMultipart: true // Important pour l'upload de fichiers
      // }
    }).subscribe(
      (result) => {
        this.isLoading = false;
        if (result.data) {
          this.router.navigate(['/dashboard/society']);
          this.snackBarService.showSuccessSnackBar(
            'Societé modifié avec succés'
          );
        }
      },
      (error) => {
        this.snackBarService.showErrorSnackBar();
        this.isLoading = false;
      }
    );
  }

  checkAdminPhone(): void {
    this.societyForm
      .get('adminPhone')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value || value.length < 10) {
            return [false];
          }

          return this.searchService.phoneNumberExists(
            value,
            false,
            this.societyId // Exclure l'organisation actuelle
          );
        })
      )
      .subscribe((result) => {
        this.societyForm.controls['adminPhone'].setErrors(null);
        this.adminPhoneExists = result;
        if (result) {
          this.societyForm.controls['adminPhone'].setErrors({
            phoneNumberExists: true,
          });
        }
      });
  }

  checkAdminEmail(): void {
    this.societyForm
      .get('adminEmail')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value || !value.includes('@')) {
            return [false];
          }

          // pour exclure l'email actuel de la vérification
          return this.searchService.emailExists(
            value,
            false,
            this.societyId // Exclure l'organisation actuelle de la vérification
          );
        })
      )
      .subscribe((result) => {
        this.adminEmailExists = result;
        this.societyForm.controls['adminEmail'].setErrors(null);

        if (result) {
          this.societyForm.controls['adminEmail'].setErrors({
            emailExists: true,
          });
        }
      });
  }

  get hasErrors(): boolean {
    return (
      this.adminPhoneExists ||
      this.adminEmailExists
    );
  }
}