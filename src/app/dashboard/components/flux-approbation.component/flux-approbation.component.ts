import { Component, OnInit } from '@angular/core';
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

export interface Approver {
  id: string;
  firstName: string;
  lastName: string;
  position?: string | null;
}

interface Niveau {
  approbateur: Approver | null;
}

@Component({
  selector: 'app-flux-approbation',
  templateUrl: './flux-approbation.component.html',
  styleUrls: ['./flux-approbation.component.scss'],
})
export class FluxApprobationComponent implements OnInit {
  readonly maxNiveaux = 3;

  niveaux: Niveau[] = [];
  approvers: Approver[] = [];
  loading = false;
  resetting = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  get isFlowEmpty(): boolean {
    return this.niveaux.length === 0;
  }

  get canAddNiveau(): boolean {
    return this.niveaux.length < this.maxNiveaux && !this.loading && !this.resetting;
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
        this.niveaux = Array.from({ length: count }, (_, i) => {
          const saved = org?.approvalFlow?.find((f) => f.level === i + 1);
          if (!saved?.approverId) return { approbateur: null };
          const fromList = this.approvers.find((a) => a.id === saved.approverId);
          return { approbateur: fromList ?? null };
        });
      },
      error: () => {
        this.snackBar.showErrorSnackBar(4000, "Erreur lors du chargement du flux d'approbation");
        this.niveaux = [];
      },
    });
  }

  private checkPendingOrders(): Observable<boolean> {
    return this.fetchMyBulkPaymentOrdersGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      map((res) => {
        const orders = res.data?.fetchMyBulkPaymentOrders ?? [];
        return orders.some((o) => o.status === BulkPaymentOrderStatus.Pending);
      }),
    );
  }

  reinitialiser(): void {
    this.checkPendingOrders().subscribe({
      next: (hasPendingOrders) => this.openResetDialog(hasPendingOrders),
      error: () => this.openResetDialog(false),
    });
  }

  private openResetDialog(hasPendingOrders: boolean): void {
    const dialogRef = this.dialog.open<ResetApprovalFlowDialogComponent, ResetApprovalFlowDialogData, boolean>(
      ResetApprovalFlowDialogComponent,
      { data: { hasPendingOrders }, width: '480px' },
    );

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.confirmReset();
    });
  }

  private confirmReset(): void {
    this.resetting = true;
    this.saveApprovalFlowGQL.mutate({ approvalLevelsCount: 0, approvalFlow: [] }).subscribe({
      next: () => {
        this.resetting = false;
        this.niveaux = [];
        this.clearMessages();
        this.snackBar.showSuccessSnackBar(3000, "Flux d'approbation réinitialisé avec succès");
      },
      error: () => {
        this.resetting = false;
        this.snackBar.showErrorSnackBar(4000, "Erreur lors de la réinitialisation du flux d'approbation");
      },
    });
  }

  ajouterNiveau(): void {
    if (!this.canAddNiveau) return;
    this.niveaux.push({ approbateur: null });
    this.clearMessages();
  }

  supprimerNiveau(index: number): void {
    this.niveaux.splice(index, 1);
    this.clearMessages();
  }

  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  /** Retourne les approbateurs disponibles pour un niveau — exclut ceux sélectionnés aux autres niveaux */
  getAvailableApprovers(levelIndex: number): Approver[] {
    const selectedIds = this.niveaux
      .filter((_, i) => i !== levelIndex)
      .map((n) => n.approbateur?.id)
      .filter(Boolean);
    return this.approvers.filter((a) => !selectedIds.includes(a.id));
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

  getNiveauHint(index: number): string {
    if (index === 0) return 'Cet utilisateur doit valider en premier.';
    return `Cet utilisateur valide après le niveau ${index}.`;
  }

  enregistrer(): void {
    this.clearMessages();

    const allSelected = this.niveaux.length > 0 && this.niveaux.every((n) => n.approbateur !== null);
    if (!allSelected) {
      this.errorMessage = 'Veuillez affecter au moins un approbateur à chaque niveau de validation';
      return;
    }

    this.loading = true;
    const approvalFlow = this.niveaux.map((n, i) => ({
      level: i + 1,
      approverId: n.approbateur!.id,
    }));

    this.saveApprovalFlowGQL.mutate({ approvalLevelsCount: this.niveaux.length, approvalFlow }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = "Flux d'approbation enregistré avec succès";
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Erreur lors de l'enregistrement";
      },
    });
  }
}
