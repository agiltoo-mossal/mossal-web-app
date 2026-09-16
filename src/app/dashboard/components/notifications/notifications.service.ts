import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { FetchCurrentAdminGQL } from 'src/graphql/generated';
import { BulkPaymentOrderStatus } from 'src/graphql/generated';
import { FetchOrdersForApproverGQL } from 'src/graphql/bulk-payment-extended';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private socket = io(environment.ENTERPRISE_URI, {
    transports: ['websocket'],
  });
  private organization: string;
  unViewedNotification: Subject<any> = new Subject();

  constructor(
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private authService: AuthService,
    private fetchOrdersForApproverGQL: FetchOrdersForApproverGQL,
  ) {
    this.fetchCurrentAdminGQL.fetch().subscribe((result) => {
      this.organization = result.data?.fetchCurrentAdmin?.organization?.id;
    });
  }
  listenForNotifications(): Observable<any> {
    const notifications = new Subject<Notification>();
    this.socket.on('notification', (notification) => {
      if (this.organization == notification.organization) {
        notifications.next(notification);
      }
    });
    return notifications.asObservable();
  }

  // Une notif de paiement en masse doit ouvrir la page de détail correspondant au rôle connecté ;
  // les autres notifications (ex: demandes) gardent leur route existante.
  // Partagé entre la liste des notifications et le dropdown de la cloche du header,
  // pour garantir le même comportement de clic aux deux endroits.
  //
  // Pour un APPROVER, la route dépend en plus de l'état du paiement : tant qu'il n'a
  // pas encore traité ce paiement (et qu'il est toujours en attente), on l'envoie sur
  // la page d'action (Approuver/Rejeter) plutôt que sur la vue en lecture seule —
  // même logique que TrackingApprovalsComponent.voirDetail().
  resolveNotifLink(notif: any): Observable<any[]> {
    const roles: string[] = this.authService.getSessionAsObject()?.roles ?? [];

    if (roles.includes('PAYMENT_MANAGER')) {
      return of(['/dashboard/payments/details', notif.entityId]);
    }

    if (roles.includes('APPROVER')) {
      const viewRoute = ['/dashboard/tracking-approvals', notif.entityId, 'view'];
      return this.fetchOrdersForApproverGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
        map((res) => {
          const order = (res.data?.fetchOrdersForApprover ?? []).find((o) => o.id === notif.entityId);
          if (!order) {
            return viewRoute;
          }
          const dejaTraite =
            (order.isApprovedByCurrentUser ?? false) ||
            order.status === BulkPaymentOrderStatus.Approved ||
            order.status === BulkPaymentOrderStatus.Rejected;
          return dejaTraite ? viewRoute : ['/dashboard/tracking-approvals', notif.entityId];
        }),
        catchError(() => of(viewRoute)),
      );
    }

    return of(['/dashboard/requests/details', notif.entityId]);
  }
}