import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { FetchCurrentAdminGQL } from 'src/graphql/generated';
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
  getNotifLink(notif: any): any[] {
    const roles: string[] = this.authService.getSessionAsObject()?.roles ?? [];
    if (roles.includes('PAYMENT_MANAGER')) {
      return ['/dashboard/payments/details', notif.entityId];
    }
    if (roles.includes('APPROVER')) {
      return ['/dashboard/tracking-approvals', notif.entityId, 'view'];
    }
    return ['/dashboard/requests/details', notif.entityId];
  }
}