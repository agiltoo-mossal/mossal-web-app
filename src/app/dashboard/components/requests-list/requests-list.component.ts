import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { CancelDemandeByAdminGQL, Demande, DemandeStatus, FetchOrganizationDemandesGQL, RejectDemandeByAdminGQL, User, ValidateDemandeGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent {
  requests: Demande[] = [];
  selectedReq: Demande;

  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.dropdownContent.nativeElement.classList.remove('show');
    } else {
      this.dropdownContent.nativeElement.classList.add('show');
    }
  }

  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private validateDemandeGQL: ValidateDemandeGQL,
    private cancelDemandeByAdminGQL: CancelDemandeByAdminGQL,
    private rejectDemandeByAdminGQL: RejectDemandeByAdminGQL,
    private snackBarService: SnackBarService
  ) {
    this.getDemandes();
  }

  getDemandes(useCache=true) {
    let cache = 'cache-first'
    if(!useCache) {
      cache = 'no-cache'
    }
    this.fetchOrganizationDemandesGQL.fetch({}, { fetchPolicy: cache as any }).subscribe(
      result => {
        this.requests = result.data.fetchOrganizationDemandes as Demande[];
        this.selectedReq = this.requests?.[0]
      }
    )
  }

  selectReq(selected: Demande) {
    this.selectedReq = selected;
  }

  cancelDemande = (demandeId: string) => {
    this.cancelDemandeByAdminGQL.mutate({ demandeId }).subscribe(
      result => {
        if(result.data.cancelDemandeByAdmin) {
          this.snackBarService.showSuccessSnackBar("demande annulée avec succés!");
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      error => {
        this.snackBarService.showErrorSnackBar(5000, "Vous ne pouvez pas effectuer cette action.");
      }
    )
  }

  rejectDemande = (demandeId: string, reason: string) => {
    this.rejectDemandeByAdminGQL.mutate({ demandeId, rejectedReason: reason }).subscribe(
      result => {
        if(result.data.rejectDemandeByAdmin) {
          this.snackBarService.showSuccessSnackBar("demande rejetée avec succés!");
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      error => {
        this.snackBarService.showErrorSnackBar(5000, "Vous ne pouvez pas effectuer cette action.");
      }
    )
  }

  validateDemande = (demandeId: string) => {
    this.validateDemandeGQL.mutate({ demandeId }).subscribe(
      result => {
        if(result.data.validateDemande) {
          this.snackBarService.showSuccessSnackBar("demande validée avec succés!");
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      error => {
        this.snackBarService.showErrorSnackBar(5000, "Vous ne pouvez pas effectuer cette action.");
      }
    )
  }

  get nbValid() {
    return this?.requests?.filter?.(r => r.status === DemandeStatus.Validated)?.length || 0;
  }

  get nbRejected() {
    return this?.requests?.filter?.(r => r.status === DemandeStatus.Rejected)?.length || 0;
  }

  get nbPending() {
    return this?.requests?.filter?.(r => r.status === DemandeStatus.Pending)?.length || 0;
  }
}
