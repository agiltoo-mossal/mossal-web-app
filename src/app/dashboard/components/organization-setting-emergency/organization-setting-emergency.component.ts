import { Component, Input } from '@angular/core';
import {
  CategorySociopro,
  FetchCategorySocioprosGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-organization-setting-emergency',
  templateUrl: './organization-setting-emergency.component.html',
  styleUrl: './organization-setting-emergency.component.scss',
})
export class OrganizationSettingEmergencyComponent {
  // Variables pour l'état des bascules
  isServiceActive: boolean = false; // Par défaut, le service est inactif
  isAutoValidation: boolean = false; // Par défaut, la validation automatique est inactive

  // Date d'activation
  activationDate: string = ''; // Format ISO (AAAA-MM-JJ)

  // Gestion des catégories
  selectedCategory: string = 'all'; // Catégorie par défaut
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];

  // Pourcentage ou montant fixe
  isPercentage: boolean = true; // Par défaut, "Pourcentage" est sélectionné
  reimbursementPercentage: number = 30; // Valeur par défaut pour le pourcentage

  @Input() serviceId: string;
  /**
   * Méthode appelée pour ajouter une nouvelle catégorie
   */
  constructor(private listCategorieGQL: FetchCategorySocioprosGQL) {}

  ngOnInit() {
    this.listCategorieGQL
      .fetch({
        queryConfig: {
          limit: 10,
        },
      })
      .subscribe((result) => {
        this.categories = result.data.fetchCategorySociopros.results;
      });
  }
  addCategory(): void {
    const newCategory = prompt('Entrez le nom de la nouvelle catégorie :');
    if (newCategory && newCategory.trim()) {
    } else {
      alert('Le nom de la catégorie ne peut pas être vide.');
    }
  }

  /**
   * Méthode pour sauvegarder les paramètres de plafond
   */
  savePlafond(): void {
    if (!this.activationDate) {
      alert('Veuillez sélectionner une date d’activation.');
      return;
    }

    if (
      this.isPercentage &&
      (this.reimbursementPercentage < 0 || this.reimbursementPercentage > 100)
    ) {
      alert('Le pourcentage doit être compris entre 0 et 100.');
      return;
    }

    // Simulation d'une sauvegarde
    console.log('Service activé:', this.isServiceActive);
    console.log('Date d’activation:', this.activationDate);
    console.log('Catégorie sélectionnée:', this.selectedCategory);
    console.log('Mode:', this.isPercentage ? 'Pourcentage' : 'Montant fixe');
    console.log('Pourcentage de remboursement:', this.reimbursementPercentage);
    console.log('Validation automatique:', this.isAutoValidation);
    alert('Paramètres sauvegardés avec succès.');
  }
}
