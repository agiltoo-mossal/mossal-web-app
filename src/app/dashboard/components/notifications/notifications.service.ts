import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { 
  FetchCurrentAdminGQL,
  ViewOrganizationNotificationsGQL  
} from 'src/graphql/generated';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private socket = io(environment.ENTERPRISE_URI, {
    transports: ['websocket'],
  });
  private organization: string;
  
  unViewedNotification: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private viewOrganizationNotificationsGQL: ViewOrganizationNotificationsGQL  // ← Ajoutez ceci
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
        // this.unViewedNotification.next(true);
      }
    });
    return notifications.asObservable();
  }
  
  // Marquer les notifications comme vues côté backend
  markNotificationsAsViewed(): Observable<any> {
    return this.viewOrganizationNotificationsGQL.mutate();
  }
  
  // Mettre à jour l'état local
  setHasUnviewedNotifications(hasUnviewed: boolean) {
    this.unViewedNotification.next(hasUnviewed);
  }
}


//Ancien
// import { Injectable } from '@angular/core';
// import { Observable, Subject } from 'rxjs';
// import { io } from 'socket.io-client';
// import { environment } from 'src/environments/environment';
// import { FetchCurrentAdminGQL } from 'src/graphql/generated';

// @Injectable({
//   providedIn: 'root',
// })
// export class NotificationsService {
//   private socket = io(environment.ENTERPRISE_URI, {
//     transports: ['websocket'],
//   });
//   private organization: string;
//   unViewedNotification: Subject<any> = new Subject();
//   constructor(private fetchCurrentAdminGQL: FetchCurrentAdminGQL) {
//     this.fetchCurrentAdminGQL.fetch().subscribe((result) => {
//       this.organization = result.data?.fetchCurrentAdmin?.organization?.id;
//     });
//   }
//   listenForNotifications(): Observable<any> {
//     const notifications = new Subject<Notification>();
//     this.socket.on('notification', (notification) => {
//       if (this.organization == notification.organization) {
//         notifications.next(notification);
//       }
//     });
//     return notifications.asObservable();
//   }
// }