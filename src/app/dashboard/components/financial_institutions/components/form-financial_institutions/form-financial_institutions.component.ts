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


@Component({
  selector: 'app-form-financial_institutions',
  templateUrl: './form-financial_institutions.component.html',
  styleUrls: ['./form-financial_institutions.component.scss'],
})
export class FormFinancialInstitutionsComponent implements OnInit, OnChanges {
  @Input() formType: string;
  formText: string = '';
  financial_institutionsForm: FormGroup;
 

  title = 'Ajout d\'une nouvelle institut financière';
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];


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
    this.financial_institutionsForm = this.fb.group({
     
      institutName: [''],
      institutDescription: [''],
      
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.formText =
      this.formType == 'edit'
        ? 'Modifier les informations de l`\'institut financière'
        : 'Création nouvelle institut financière';

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
  }

  // Méthode pour soumettre le formulaire
 submitForm() {
  if (this.financial_institutionsForm.invalid) {
    this.financial_institutionsForm.markAllAsTouched();
    return;
  }

}
}