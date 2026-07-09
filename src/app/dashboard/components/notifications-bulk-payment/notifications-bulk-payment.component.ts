import { Component, OnInit } from '@angular/core';

export type NotificationStatus = 'approved' | 'approvedLevel' | 'rejected';

export interface AppNotification {
  id: string;
  message: string;        // ex: "Votre ordre de paiement : "
  highlight: string;      // ex: "Paiement du mois de Mars 2026"
  suffix: string;         // ex: " a été approuvé."
  authors: string[];      // ex: ["Maïté SARR", "Khadija SARR"]
  createdAt: Date;
  read: boolean;
  status: NotificationStatus;
}

@Component({
  selector: 'app-notifications-bulk-payment',
  templateUrl: './notifications-bulk-payment.component.html',
  styleUrls: ['./notifications-bulk-payment.component.scss']
})
export class NotificationsBulkPaymentComponent implements OnInit {

  // Onglet actif : 'all' | 'unread' | 'read'
  activeTab: 'all' | 'unread' | 'read' = 'all';

  currentUser = {
    name: 'Awa FALL',
    role: 'Rh/Gestionnaire'
  };

  hasUnreadAlert = true;

  notifications: AppNotification[] = [];

  constructor() {}

  ngOnInit(): void {
    // TODO: remplacer par un appel au service / GraphQL
    this.notifications = [
      {
        id: '1',
        message: 'Votre ordre de paiement : ',
        highlight: 'Paiement du mois de Mars 2026',
        suffix: ' a été approuvé.',
        authors: ['Maïté SARR', 'Khadija SARR'],
        createdAt: this.minutesAgo(3),
        read: false,
        status: 'approved'
      },
      {
        id: '2',
        message: 'Votre ordre de paiement : ',
        highlight: 'Paiement du mois de Mars 2026',
        suffix: ' a été approuvé par le niveau 1.',
        authors: ['Maïté SARR'],
        createdAt: this.minutesAgo(3),
        read: true,
        status: 'approvedLevel'
      },
      {
        id: '3',
        message: 'Votre ordre de paiement : ',
        highlight: 'Paiement du mois de Mars 2026',
        suffix: ' a été rejeté par le niveau 2.',
        authors: ['Khadija SARR'],
        createdAt: this.minutesAgo(3),
        read: true,
        status: 'rejected'
      }
    ];
  }

  private minutesAgo(minutes: number): Date {
    return new Date(Date.now() - minutes * 60 * 1000);
  }

  get filteredNotifications(): AppNotification[] {
    switch (this.activeTab) {
      case 'unread':
        return this.notifications.filter(n => !n.read);
      case 'read':
        return this.notifications.filter(n => n.read);
      default:
        return this.notifications;
    }
  }

  selectTab(tab: 'all' | 'unread' | 'read'): void {
    this.activeTab = tab;
  }

  authorsLabel(notification: AppNotification): string {
    if (!notification.authors.length) {
      return '';
    }
    if (notification.authors.length === 1) {
      return `Par ${notification.authors[0]}`;
    }
    const last = notification.authors[notification.authors.length - 1];
    const rest = notification.authors.slice(0, -1).join(', ');
    return `Par ${rest} et ${last}`;
  }

  timeAgoLabel(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.max(1, Math.round(diffMs / 60000));
    if (diffMin < 60) {
      return `Il y a ${diffMin} min`;
    }
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) {
      return `Il y a ${diffH} h`;
    }
    const diffD = Math.round(diffH / 24);
    return `Il y a ${diffD} j`;
  }

  markAsRead(notification: AppNotification): void {
    notification.read = true;
  }
}