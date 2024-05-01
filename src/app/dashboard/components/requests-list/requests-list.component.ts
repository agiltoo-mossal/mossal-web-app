import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  CancelDemandeByAdminGQL,
  Demande,
  DemandeStatus,
  FetchOrganizationDemandesGQL,
  PayeDemandeGQL,
  RejectDemandeByAdminGQL,
  User,
  ValidateDemandeGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent {
  requests: Demande[] = [];
  selectedReq: Demande;
  min: number = 0;
  max: number = 10000;
  startDate: string = "2024-01-01";
  endDate: string = "2024-12-31";
  status: DemandeStatus = null;
  search: string = "";

  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private validateDemandeGQL: ValidateDemandeGQL,
    private payeDemandeGQL: PayeDemandeGQL,
    private cancelDemandeByAdminGQL: CancelDemandeByAdminGQL,
    private rejectDemandeByAdminGQL: RejectDemandeByAdminGQL,
    private snackBarService: SnackBarService
  ) {
    this.getDemandes();
  }

  isMenuFilterOpen: boolean = false;
  toggleMenuFilterDate() {
    this.isMenuFilterOpen = !this.isMenuFilterOpen;
  }

  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  @ViewChild('btnToggleDropdownDate') btnToggleDropdownDate: ElementRef;
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.isMenuFilterOpen) {
      return;
    }
    const target = event.target as HTMLElement;
    if (
      !this.dropdownContent.nativeElement.contains(target) &&
      !this.btnToggleDropdownDate.nativeElement.contains(target)
    ) {
      this.isMenuFilterOpen = false;
    }
  }

  getDemandes(useCache = true) {
    let cache = 'cache-first';
    if (!useCache) {
      cache = 'no-cache';
    }
    this.fetchOrganizationDemandesGQL
      .fetch({}, { fetchPolicy: cache as any })
      .subscribe((result) => {
        this.requests = result.data.fetchOrganizationDemandes as Demande[];
        this.selectedReq = this.requests?.[0];
        console.log({r: this.requests})
      });
  }

  selectReq(selected: Demande) {
    this.selectedReq = selected;
  }

  cancelDemande = (demandeId: string) => {
    this.cancelDemandeByAdminGQL.mutate({ demandeId }).subscribe(
      (result) => {
        if (result.data.cancelDemandeByAdmin) {
          this.snackBarService.showSuccessSnackBar(
            'demande annulée avec succés!'
          );
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      (error) => {
        this.snackBarService.showErrorSnackBar(
          5000,
          'Vous ne pouvez pas effectuer cette action.'
        );
      }
    );
  };

  rejectDemande = (demandeId: string, reason: string) => {
    this.rejectDemandeByAdminGQL
      .mutate({ demandeId, rejectedReason: reason })
      .subscribe(
        (result) => {
          if (result.data.rejectDemandeByAdmin) {
            this.snackBarService.showSuccessSnackBar(
              'demande rejetée avec succés!'
            );
            this.getDemandes(false);
          } else {
            this.snackBarService.showErrorSnackBar();
          }
        },
        (error) => {
          this.snackBarService.showErrorSnackBar(
            5000,
            'Vous ne pouvez pas effectuer cette action.'
          );
        }
      );
  };

  validateDemande = (demandeId: string) => {
    this.validateDemandeGQL.mutate({ demandeId }).subscribe(
      (result) => {
        if (result.data.validateDemande) {
          this.snackBarService.showSuccessSnackBar(
            'demande validée avec succés!'
          );
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      (error) => {
        this.snackBarService.showErrorSnackBar(
          5000,
          'Vous ne pouvez pas effectuer cette action.'
        );
      }
    );
  };

  payeDemande = (demandeId: string) => {
    this.payeDemandeGQL.mutate({ demandeId }).subscribe(
      (result) => {
        if (result.data.payeDemande) {
          this.snackBarService.showSuccessSnackBar(
            'demande payée avec succés!'
          );
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      (error) => {
        this.snackBarService.showErrorSnackBar(
          5000,
          'Vous ne pouvez pas effectuer cette action.'
        );
      }
    );
  };

  get nbValid() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Validated)
        ?.length || 0
    );
  }

  get nbRejected() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Rejected)
        ?.length || 0
    );
  }

  get nbPending() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Pending)
        ?.length || 0
    );
  }

  changeMinMax(mini, maxi) {
    this.min = mini; this.max = maxi;
  }

  changeStatus(state) {
    this.status = state;
  }

  resetFilter() {
    this.min = 0;
    this.max = 10000;
    this.startDate = "2024-01-01";
    this.endDate = "2024-12-31";
    this.status = null;
    this.search = "";
  }
}
