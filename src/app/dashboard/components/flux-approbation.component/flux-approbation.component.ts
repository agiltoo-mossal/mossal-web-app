import { Component, Inject, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  FetchApprovalFlowGQL,
  FetchOrganizationApproversGQL,
  SaveApprovalFlowGQL,
  FetchMyBulkPaymentOrdersGQL,
  BulkPaymentOrderStatus,
} from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  ResetApprovalFlowDialogComponent,
  ResetApprovalFlowDialogData,
} from './reset-approval-flow-dialog/reset-approval-flow-dialog.component';
import {
  ApproverRemovalWarningDialogComponent,
  ApproverRemovalWarningData,
} from './approver-removal-warning-dialog/approver-removal-warning-dialog.component';

export interface Approver {
  id: string;
  firstName: string;
  lastName: string;
  position?: string | null;
}

interface Niveau {
  approbateurs: Approver[];
}

@Component({
  selector: 'app-flux-approbation',
  templateUrl: './flux-approbation.component.html',
  styleUrls: ['./flux-approbation.component.scss'],
})
export class FluxApprobationComponent implements OnInit {
  readonly niveauxOptions = [1, 2, 3];

  nombreNiveaux: number | null = null;
  niveaux: Niveau[] = [];
  approvers: Approver[] = [];
  private savedApprovers: Approver[] = [];

  loading = false;
  resetting = false;
  submitted = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  get isFlowEmpty(): boolean {
    return this.niveaux.length === 0;
  }

  get noApproverAvailable(): boolean {
    return this.approvers.length === 0;
  }

  constructor(
    private fetchApprovalFlowGQL: FetchApprovalFlowGQL,
    private fetchApproversGQL: FetchOrganizationApproversGQL,
    private saveApprovalFlowGQL: SaveApprovalFlowGQL,
    private fetchMyBulkPaymentOrdersGQL: FetchMyBulkPaymentOrdersGQL,
    private snackBar: SnackBarService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      approvers: this.fetchApproversGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(map((r) => r.data)),
      flow: this.fetchApprovalFlowGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(map((r) => r.data)),
    }).subscribe({
      next: ({ approvers, flow }) => {
        this.approvers = (approvers.fetchOrganizationApprovers ?? []).map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          position: u.position,
        }));

        const org = flow.fetchApprovalFlow;
        const count = org?.approvalLevelsCount ?? 0;
        this.nombreNiveaux = count || null;
        this.niveaux = Array.from({ length: count }, (_, i) => {
          const saved = org?.approvalFlow?.find((f) => f.level === i + 1);
          // ⚠️ nécessite `approverIds: string[]` côté backend (cf. notes)
          return { approbateurs: this.approvers.filter((a) => (saved?.approverId ?? []).includes(a.id)) };
        });
        this.savedApprovers = this.niveaux.flatMap((n) => n.approbateurs);
      },
      error: () => {
        this.snackBar.showErrorSnackBar(4000, "Erreur lors du chargement du flux d'approbation");
        this.niveaux = [];
      },
    });
  }

  // ---------- Nombre de niveaux ----------
  onNombreNiveauxChange(n: number): void {
    this.nombreNiveaux = n;
    if (n > this.niveaux.length) {
      while (this.niveaux.length < n) this.niveaux.push({ approbateurs: [] });
    } else {
      this.niveaux = this.niveaux.slice(0, n);
    }
    this.clearMessages();
  }

  // ---------- Approbateurs d'un niveau ----------
  onApproversChange(levelIndex: number, value: Approver[]): void {
    this.niveaux[levelIndex].approbateurs = value;
    this.clearMessages();
  }

  removeApprover(levelIndex: number, approver: Approver): void {
    this.niveaux[levelIndex].approbateurs = this.niveaux[levelIndex].approbateurs.filter(
      (a) => a.id !== approver.id,
    );
    this.clearMessages();
  }

  /** Approbateurs proposés pour un niveau : exclut ceux déjà choisis dans les autres niveaux */
  getAvailableApprovers(levelIndex: number): Approver[] {
    const usedElsewhere = new Set(
      this.niveaux.filter((_, i) => i !== levelIndex).flatMap((n) => n.approbateurs.map((a) => a.id)),
    );
    return this.approvers.filter((a) => !usedElsewhere.has(a.id));
  }

  compareApprovers(a: Approver, b: Approver): boolean {
    return a?.id === b?.id;
  }

  getNiveauSubtitle(index: number): string {
    const subtitles: Record<number, string> = {
      0: 'Premier niveau de validation',
      1: 'Deuxième niveau de validation',
      2: 'Troisième niveau de validation',
    };
    return subtitles[index] ?? `Niveau ${index + 1} de validation`;
  }

  initials(a: Approver): string {
    return `${a.firstName?.[0] ?? ''}${a.lastName?.[0] ?? ''}`.toUpperCase();
  }

  enregistrer(): void {
    this.clearMessages();
    this.submitted = true;

    const allFilled = this.niveaux.length > 0 && this.niveaux.every((n) => n.approbateurs.length > 0);
    if (!allFilled) {
      this.errorMessage = 'Veuillez sélectionner au moins un approbateur pour ce niveau de validation.';
      return;
    }

    const currentIds = new Set(this.niveaux.flatMap((n) => n.approbateurs.map((a) => a.id)));
    const removed = this.savedApprovers.filter((a) => !currentIds.has(a.id));
    if (!removed.length) {
      this.persist();
      return;
    }

    this.loading = true;
    this.getPendingOrdersCounts().subscribe({
      next: (counts) => {
        this.loading = false;
        const items = removed
          .filter((a) => (counts[a.id] ?? 0) > 0)
          .map((a) => ({ name: `${a.firstName} ${a.lastName}`, count: counts[a.id] }));
        if (!items.length) {
          this.persist();
          return;
        }
        this.dialog
          .open<ApproverRemovalWarningDialogComponent, ApproverRemovalWarningData, boolean>(
            ApproverRemovalWarningDialogComponent,
            { data: { items }, width: '480px' },
          )
          .afterClosed()
          .subscribe((confirmed) => {
            if (confirmed) this.persist();
          });
      },
      error: () => {
        this.loading = false;
        this.persist();
      },
    });
  }

  private persist(): void {
    this.loading = true;
    const approvalFlow = this.niveaux.map((n, i) => ({
      level: i + 1,
      approverIds: n.approbateurs.map((a) => a.id), // ⚠️ était `approverId`
    }));

    this.saveApprovalFlowGQL.mutate({ approvalLevelsCount: this.niveaux.length, approvalFlow }).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = false;
        this.savedApprovers = this.niveaux.flatMap((n) => n.approbateurs);
        this.successMessage = "Flux d'approbation enregistré avec succès";
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Erreur lors de l'enregistrement";
      },
    });
  }

  private getPendingOrdersCounts(): Observable<Record<string, number>> {
    return this.fetchMyBulkPaymentOrdersGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      map((res) => {
        const counts: Record<string, number> = {};
        (res.data?.fetchMyBulkPaymentOrders ?? [])
          .filter((o) => o.status === BulkPaymentOrderStatus.Pending)
          .forEach((o: any) => (o.approvers ?? []).forEach((a: { id: string }) => {
            counts[a.id] = (counts[a.id] ?? 0) + 1;
          }));
        return counts;
      }),
    );
  }

  reinitialiser(): void {
    this.fetchMyBulkPaymentOrdersGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      map((res) => (res.data?.fetchMyBulkPaymentOrders ?? []).some((o) => o.status === BulkPaymentOrderStatus.Pending)),
    ).subscribe({
      next: (hasPendingOrders) => this.openResetDialog(hasPendingOrders),
      error: () => this.openResetDialog(false),
    });
  }

  private openResetDialog(hasPendingOrders: boolean): void {
    this.dialog
      .open<ResetApprovalFlowDialogComponent, ResetApprovalFlowDialogData, boolean>(
        ResetApprovalFlowDialogComponent,
        { data: { hasPendingOrders }, width: '480px' },
      )
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.confirmReset();
      });
  }

  private confirmReset(): void {
    this.resetting = true;
    this.saveApprovalFlowGQL.mutate({ approvalLevelsCount: 0, approvalFlow: [] }).subscribe({
      next: () => {
        this.resetting = false;
        this.niveaux = [];
        this.nombreNiveaux = null;
        this.savedApprovers = [];
        this.submitted = false;
        this.clearMessages();
        this.snackBar.showSuccessSnackBar(3000, "Flux d'approbation réinitialisé avec succès");
      },
      error: () => {
        this.resetting = false;
        this.snackBar.showErrorSnackBar(4000, "Erreur lors de la réinitialisation du flux d'approbation");
      },
    });
  }

  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
}