import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { FetchCurrentAdminGQL } from 'src/graphql/generated';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private socket = io(environment.ENTERPRISE_URI);
  private organization: string;
  unViewedNotification: Subject<any> = new Subject();
  constructor(private fetchCurrentAdminGQL: FetchCurrentAdminGQL) {
    this.fetchCurrentAdminGQL.fetch().subscribe(
      result => {
        this.organization = result.data?.fetchCurrentAdmin?.organization?.id;
      }
    )
  }
  listenForNotifications(): Observable<any> {
    const notifications = new Subject<Notification>();
    this.socket.on('notification', (notification) => {
      if(this.organization == notification.organization) {
        notifications.next(notification);
      }

    });
    return notifications.asObservable();
  }
}
