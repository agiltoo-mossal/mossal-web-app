import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-organization-setting-event',
  templateUrl: './organization-setting-event.component.html',
  styleUrl: './organization-setting-event.component.scss',
})
export class OrganizationSettingEventComponent {
  // Données pour les événements
  @Input() serviceId: string;

  events = [
    {
      name: 'Événement 1',
      startDate: '2024-10-10',
      endDate: '2024-10-10',
      isActive: true,
    },
    {
      name: 'Événement 2',
      startDate: '2024-10-10',
      endDate: '2024-10-10',
      isActive: false,
    },
  ];

  // Onglet actif
  activeTab: string = 'Paramètres Généraux';

  // Données pour les paramètres
  isServiceActive: boolean = true;
  isPercentage: boolean = true;
  reimbursementPercentage: number = 30;
  reimbursementDuration: string = '12 mois';
  isAutoValidation: boolean = false;

  /**
   * Permet de basculer entre les onglets
   * @param tabName Nom de l'onglet
   */
  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  /**
   * Ajoute un nouvel événement à la liste
   */
  addEvent(): void {
    const newEvent = {
      name: `Événement ${this.events.length + 1}`,
      startDate: '',
      endDate: '',
      isActive: false,
    };
    this.events.push(newEvent);
  }

  /**
   * Supprime un événement de la liste
   * @param index Index de l'événement à supprimer
   */
  deleteEvent(index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      this.events.splice(index, 1);
    }
  }

  /**
   * Met à jour l'état actif/inactif d'un événement
   * @param index Index de l'événement à mettre à jour
   * @param isActive Nouveau statut actif/inactif
   */
  toggleEventStatus(index: number, isActive: boolean): void {
    this.events[index].isActive = isActive;
  }

  /**
   * Sauvegarde les paramètres globaux
   */
  saveSettings(): void {
    // Valider les données avant de sauvegarder
    if (
      this.isPercentage &&
      (this.reimbursementPercentage < 0 || this.reimbursementPercentage > 100)
    ) {
      alert('Le pourcentage doit être compris entre 0 et 100.');
      return;
    }

    // Afficher un message de confirmation
    console.log('Service activé :', this.isServiceActive);
    console.log(
      'Type de remboursement :',
      this.isPercentage ? 'Pourcentage' : 'Montant fixe'
    );
    console.log('Pourcentage :', this.reimbursementPercentage);
    console.log('Durée :', this.reimbursementDuration);
    console.log('Validation automatique :', this.isAutoValidation);
    alert('Paramètres sauvegardés avec succès.');
  }
}
