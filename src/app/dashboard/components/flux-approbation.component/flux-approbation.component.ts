import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FetchApprovalFlowGQL,
  FetchOrganizationApproversGQL,
  SaveApprovalFlowGQL,
} from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

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
  nombreNiveaux = 1;
  niveaux: Niveau[] = [];
  approvers: Approver[] = [];
  loading = false;

  constructor(
    private fetchApprovalFlowGQL: FetchApprovalFlowGQL,
    private fetchApproversGQL: FetchOrganizationApproversGQL,
    private saveApprovalFlowGQL: SaveApprovalFlowGQL,
    private snackBar: SnackBarService,
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
        if (org?.approvalLevelsCount) {
          this.nombreNiveaux = org.approvalLevelsCount;
        }

        this.niveaux = Array.from({ length: this.nombreNiveaux }, (_, i) => {
          const saved = org?.approvalFlow?.find((f) => f.level === i + 1);
          if (!saved?.approverId) return { approbateur: null };
          const fromList = this.approvers.find((a) => a.id === saved.approverId);
          return { approbateur: fromList ?? null };
        });
      },
      error: () => {
        this.snackBar.showErrorSnackBar(4000, 'Erreur lors du chargement du flux d\'approbation');
        this.initNiveaux();
      },
    });
  }

  initNiveaux(): void {
    this.niveaux = Array.from({ length: this.nombreNiveaux }, () => ({ approbateur: null }));
  }

  onNiveauxChange(): void {
    const current = this.niveaux.length;
    if (this.nombreNiveaux > current) {
      for (let i = current; i < this.nombreNiveaux; i++) {
        this.niveaux.push({ approbateur: null });
      }
    } else {
      this.niveaux = this.niveaux.slice(0, this.nombreNiveaux);
    }
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

  reinitialiser(): void {
    this.nombreNiveaux = 1;
    this.initNiveaux();
  }

  enregistrer(): void {
    const allSelected = this.niveaux.every((n) => n.approbateur !== null);
    if (!allSelected) {
      this.snackBar.showErrorSnackBar(4000, 'Veuillez sélectionner un approbateur pour chaque niveau');
      return;
    }

    this.loading = true;
    const approvalFlow = this.niveaux.map((n, i) => ({
      level: i + 1,
      approverId: n.approbateur!.id,
    }));

    this.saveApprovalFlowGQL
      .mutate({ approvalLevelsCount: this.nombreNiveaux, approvalFlow })
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.showSuccessSnackBar('Flux d\'approbation enregistré avec succès');
        },
        error: () => {
          this.loading = false;
          this.snackBar.showErrorSnackBar(4000, 'Erreur lors de l\'enregistrement');
        },
      });
  }
}
