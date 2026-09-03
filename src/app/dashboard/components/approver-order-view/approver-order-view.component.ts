import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { FetchOrderForApproverByIdGQL } from 'src/graphql/bulk-payment-extended';
import { Wallet } from 'src/graphql/generated';

interface ApprovalStep {
  niveau: number;
  approbateurNom: string;
  approbateurRole: string;
  statut: 'valide' | 'en_attente' | 'rejete';
  dateNotification?: string;
  motifRejet?: string;
}

interface Beneficiaire {
  nom: string;
  prenom: string;
  telephone: string;
  montant: number;
  operateur: string;
}

interface OrderDetail {
  libelle: string;
  nombreBeneficiaires: number;
  montantTotal: number;
  operateurs: number;
  dateSoumission: string;
}

@Component({
  selector: 'app-approver-order-view',
  templateUrl: './approver-order-view.component.html',
  styleUrls: ['./approver-order-view.component.scss'],
})
export class ApproverOrderViewComponent implements OnInit {
  isLoading = true;
  orderDetail: OrderDetail | null = null;
  approvalSteps: ApprovalStep[] = [];
  beneficiaires: Beneficiaire[] = [];
  isRejected = false;
  isApproved = false;
  isPending = false;
  isBeneficiairesOpen = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fetchOrderForApproverByIdGQL: FetchOrderForApproverByIdGQL,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.isLoading = false; return; }

    this.fetchOrderForApproverByIdGQL
      .fetch({ id }, { fetchPolicy: 'network-only' })
      .subscribe({
        next: (res) => {
          const order = res.data?.fetchOrderForApproverById;
          if (!order) { this.isLoading = false; return; }

          const payments = order.payments ?? [];
          const approvers = order.approvers ?? [];
          const approvals = order.approvals ?? [];
          const uniqueWallets = new Set(payments.map(p => p.wallet));

          this.isRejected = (order.status as string) === 'REJECTED';
          this.isApproved = (order.status as string) === 'APPROVED';
          this.isPending = (order.status as string) === 'PENDING';

          this.orderDetail = {
            libelle: order.label,
            nombreBeneficiaires: payments.length,
            montantTotal: order.totalAmount,
            operateurs: uniqueWallets.size,
            dateSoumission: new Intl.DateTimeFormat('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }).format(new Date(order.createdAt)),
          };

          this.approvalSteps = approvers.map((approver, i) => {
            const level = i + 1;
            const approval = approvals.find(a => a.level === level);
            const nom = `${approver.firstName} ${approver.lastName}`;

            if (approval) {
              return {
                niveau: level,
                approbateurNom: nom,
                approbateurRole: `Approbateur N°${level}`,
                statut: 'valide' as const,
                dateNotification: approval.approvedAt
                  ? new Intl.DateTimeFormat('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    }).format(new Date(approval.approvedAt))
                  : undefined,
              };
            } else if (this.isRejected && level === order.currentApprovalLevel) {
              return {
                niveau: level,
                approbateurNom: nom,
                approbateurRole: `Approbateur N°${level}`,
                statut: 'rejete' as const,
                motifRejet: order.rejectedReason ?? undefined,
              };
            } else {
              return {
                niveau: level,
                approbateurNom: nom,
                approbateurRole: `Approbateur N°${level}`,
                statut: 'en_attente' as const,
              };
            }
          });

          this.beneficiaires = payments.map(p => ({
            nom: p.lastName,
            prenom: p.firstName,
            telephone: p.phoneNumber,
            montant: p.amount,
            operateur: p.wallet === Wallet.Wave ? 'Wave' : 'Orange Money',
          }));

          this.isLoading = false;
        },
        error: () => { this.isLoading = false; },
      });
  }

  get currentApproverWaiting(): ApprovalStep | undefined {
    return this.approvalSteps.find(s => s.statut === 'en_attente');
  }

  get lastApprovedApprover(): ApprovalStep | undefined {
    const approved = this.approvalSteps.filter(s => s.statut === 'valide');
    return approved.length > 0 ? approved[approved.length - 1] : undefined;
  }

  get hasSomeoneApproved(): boolean {
    return !!this.lastApprovedApprover;
  }

  get rejectedApprover(): ApprovalStep | undefined {
    return this.approvalSteps.find(s => s.statut === 'rejete');
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' XOF';
  }

  toggleBeneficiairesList(): void {
    this.isBeneficiairesOpen = !this.isBeneficiairesOpen;
  }

  telechargerListe(): void {
    if (!this.beneficiaires.length) return;

    const statutGlobal = this.isApproved ? 'Validé' : this.isRejected ? 'Rejeté' : 'En attente';
    const rows = [
      ['Nom', 'Prénom', 'Téléphone', 'Montant', 'Opérateur', 'Statut'],
      ...this.beneficiaires.map(b => [b.nom, b.prenom, b.telephone, b.montant, b.operateur, statutGlobal]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook: XLSX.WorkBook = { Sheets: { 'Bénéficiaires': worksheet }, SheetNames: ['Bénéficiaires'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Le nom du fichier doit correspondre exactement au libellé de l'ordre.
    const filename = (this.orderDetail?.libelle ?? 'ordre').replace(/[\\/]/g, '-');
    a.download = `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  retour(): void {
    this.location.back();
  }
}
