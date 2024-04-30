import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  Demande,
  DemandesMetrics,
  DemandeStatus,
  FetchDemandesMetricsGQL,
  FetchOrganizationCollaboratorsGQL,
  FetchOrganizationDemandesGQL,
  User,
} from 'src/graphql/generated';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  datas = [];

  requests: Demande[] = [];
  sortedRequests: Demande[] = [];
  selectedReq: Demande;
  collabs: any[] = [];
  selectedCollab: User;
  metricsInput: FormGroup;
  metricsData: DemandesMetrics;
  isMenuFilterOpen: boolean = false;
  sortBy: "createdAt" | "hasValidatedDemande" = "createdAt";

  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private fetchOrganizationCollaboratorsGQL: FetchOrganizationCollaboratorsGQL,
    private snackBarService: SnackBarService,
    private fetchDemandesMetricsGQL: FetchDemandesMetricsGQL,
    private fb: FormBuilder
  ) {
    const now = new Date("2024-12-31");
    this.metricsInput = this.fb.group({
      startDate: ['2024-01-01'],
      endDate: [`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`]
    })
    this.metricsInput.valueChanges.subscribe(
      r => {
        this.getData();
      }
    )
    this.getData();
  }

  getData() {
    this.getDemandes();
    this.fetchCollabs();
    this.getDemandesMetrics();
  }

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

  get startDate() {
    return this.metricsInput.controls['startDate'].value;
  }

  get endDate() {
    return this.metricsInput.controls['endDate'].value;
  }

  getDemandes(useCache = true) {
    let cache = 'cache-first';
    if (!useCache) {
      cache = 'no-cache';
    }
    this.fetchOrganizationDemandesGQL
      .fetch({ metricsInput: this.metricsInput.value }, { fetchPolicy: cache as any })
      .subscribe((result) => {
        this.requests = result.data.fetchOrganizationDemandes as Demande[];
        this.selectedReq = this.requests?.[0];
        this.sortedRequests = this.requests
          .slice()
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)) as Demande[];
          this.setHasValidatedDemande();
      });
  }

  getDemandesMetrics() {
    const startDate = this.metricsInput.value.startDate || new Date('2024-01-01');
    const endDate = this.metricsInput.value.endDate || new Date();
    this.fetchDemandesMetricsGQL.fetch({ metricsInput: { startDate, endDate } }).subscribe(
      result => {
        this.metricsData = result.data.fetchDemandesMetrics as any;
      }
    )
  }

  fetchCollabs() {
    this.fetchOrganizationCollaboratorsGQL
      .fetch({ metricsInput: this.metricsInput.value }, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.collabs = result.data.fetchOrganizationCollaborators as User[];
        this.setHasValidatedDemande();
        this.selectedCollab = this.collabs?.[0];
      });
  }

  setHasValidatedDemande() {
    this.collabs = this.collabs.map(c => {
      c.hasValidatedDemande = false;
      if(this.getValidatedRequest(c.id)) {
        c.hasValidatedDemande = true;
      }
      return c;
    })
  }

  selectCollab(selected: User) {
    this.selectedCollab = selected;
  }

  selectReq(selected: Demande) {
    this.selectedReq = selected;
  }

  get nbValid() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Validated)
        ?.length || 0
    );
  }

  get nbAccordedRequest() {
    return (
      this?.requests?.filter?.((r) => [DemandeStatus.Validated, DemandeStatus.Payed].includes(r.status))
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

  get totalDemandeAmount() {
    return (
      this?.requests
        ?.filter?.((r) =>
          [DemandeStatus.Validated, DemandeStatus.Payed].includes(r.status)
        )
        ?.reduce((a, b) => a + b.amount, 0) || 0
    );
  }

  get totalDemandeToPay() {
    return (
      this?.requests
        ?.filter?.((r) => [DemandeStatus.Validated].includes(r.status))
        ?.reduce((a, b) => a + b.amount, 0) || 0
    );
  }

  get nbActifUsers() {
    const users = [];
    this?.collabs?.map?.((r) => {
      if (!users.includes(r.id)) {
        users.push(r.id);
      }
    });
    return users.length;
  }

  ngOnInit(): void {}

  getLastRequest(collabId: string) {
    return this.sortedRequests.find((r) => r.collaborator.id == collabId);
  }

  getValidatedRequest(collabId: string) {
    return this.sortedRequests.find((r) => {
      return r.collaborator.id == collabId && r.status == DemandeStatus.Validated
    });
  }

}
