export type PaymentStatut = 'EN_ATTENTE' | 'APPROUVE' | 'EN_COURS' | 'PAYE' | 'ECHEC' | 'REJETE' | 'ANNULE';

// Statut backend du paiement (BulkPaymentStatus) -> statut affiché.
const PAYMENT_STATUT_MAP: Record<string, PaymentStatut> = {
  PENDING: 'EN_ATTENTE',
  VALIDATED: 'APPROUVE',
  IN_PROCESS: 'EN_COURS',
  PAYED: 'PAYE',
  REJECTED: 'ECHEC',
  CANCELLED: 'ANNULE',
};

export const PAYMENT_STATUT_LABELS: Record<PaymentStatut, string> = {
  EN_ATTENTE: 'En attente',
  APPROUVE: 'Approuvé',
  EN_COURS: 'En cours',
  PAYE: 'Payé',
  ECHEC: 'Échec',
  REJETE: 'Rejeté',
  ANNULE: 'Annulé',
};

export const PAYMENT_STATUT_BADGES: Record<PaymentStatut, string> = {
  EN_ATTENTE: 'badge-pending',
  APPROUVE: 'badge-info',
  EN_COURS: 'badge-info',
  PAYE: 'badge-success',
  ECHEC: 'badge-danger',
  REJETE: 'badge-danger',
  ANNULE: 'badge-neutral',
};

// Date d'exécution d'un ordre validé : date d'approbation du dernier approbateur
// (positionnement des fonds). On prend la plus récente, car une nouvelle tentative
// après un échec de virement ajoute une approbation au dernier niveau.
export function orderExecutionDate(
  orderStatus: string,
  approvals: ReadonlyArray<{ approvedAt?: string | null }> | null | undefined,
): Date | undefined {
  if (orderStatus !== 'APPROVED') return undefined;
  const times = (approvals ?? [])
    .map((a) => (a.approvedAt ? new Date(a.approvedAt).getTime() : NaN))
    .filter((t) => !isNaN(t));
  return times.length ? new Date(Math.max(...times)) : undefined;
}

// Le statut d'un paiement n'est pas mis à jour au rejet/annulation de l'ordre :
// un paiement resté PENDING prend alors le statut de l'ordre.
export function mapPaymentStatut(raw: string | undefined, orderStatus: string): PaymentStatut {
  if (!raw || raw === 'PENDING') {
    if (orderStatus === 'REJECTED') return 'REJETE';
    if (orderStatus === 'CANCELLED') return 'ANNULE';
  }
  return PAYMENT_STATUT_MAP[raw ?? ''] ?? 'EN_ATTENTE';
}
