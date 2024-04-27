import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  userList = [{}, {}, {}, {}, {}, {}, {}];

  requests: Demande[] = [];
  sortedRequests: Demande[] = [];
  selectedReq: Demande;
  collabs: User[] = [];
  selectedCollab: User;
  metricsInput: FormGroup;
  metricsData: DemandesMetrics;

  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private fetchOrganizationCollaboratorsGQL: FetchOrganizationCollaboratorsGQL,
    private snackBarService: SnackBarService,
    private fetchDemandesMetricsGQL: FetchDemandesMetricsGQL,
    private fb: FormBuilder
  ) {
    this.metricsInput = this.fb.group({
      startDate: ['2024-01-01'],
      endDate: [new Date()]
    })
    this.getDemandes();
    this.fetchCollabs();
    this.getDemandesMetrics();
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
        this.sortedRequests = this.requests
          .slice()
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)) as Demande[];
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
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.collabs = result.data.fetchOrganizationCollaborators as User[];
        this.selectedCollab = this.collabs?.[0];
      });
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
          [DemandeStatus.Validated, DemandeStatus.Pending].includes(r.status)
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

  // pieChart: GoogleChartInterface = {
  //   chartType: GoogleChartType.PieChart, // or chartType: 'PieChart'
  //   dataTable: [
  //     ['Task', 'Hours per Day'],
  //     ['Work', 11],
  //     ['Eat', 2],
  //     ['Commute', 2],
  //     ['Watch TV', 2],
  //     ['Sleep', 7],
  //   ],
  //   // firstRowIsData: true,
  //   options: { title: 'Tasks' },
  // };
  chartData: GoogleChartInterface = {
    // chartType: 'LineChart',
    chartType: GoogleChartType.LineChart,
    dataTable: [
      [1, 37.8, 80.8, 41.8],
      [2, 30.9, 69.5, 32.4],
      [3, 25.4, 57, 25.7],
      [4, 11.7, 18.8, 10.5],
      [5, 11.9, 17.6, 10.4],
      [6, 8.8, 13.6, 7.7],
      [7, 7.6, 12.3, 9.6],
      [8, 12.3, 29.2, 10.6],
      [9, 16.9, 42.9, 14.8],
      [10, 12.8, 30.9, 11.6],
      [11, 5.3, 7.9, 4.7],
      [12, 6.6, 8.4, 5.2],
      [13, 4.8, 6.3, 3.6],
      [14, 4.2, 6.2, 3.4],
    ],
    // columnNames: [
    //   'Day',
    //   'Guardians of the Galaxy',
    //   'The Avengers',
    //   'Transformers: Age of Extinction',
    // ],
    options: {
      hAxis: {
        title: 'Box Office Earnings in First Two Weeks of Opening',
      },
      vAxis: {
        title: 'in millions of dollars (USD)',
      },
    },
    // width: 1000,
    // height: 400,
  };
}
