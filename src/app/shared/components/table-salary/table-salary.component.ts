import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-salary',

  templateUrl: './table-salary.component.html',
  styleUrl: './table-salary.component.scss',
})
export class TableSalaryComponent {
  @Input() title: string = 'Avance salariale remboursable mensuellement'; // Titre dynamique
  @Input() supportLabel: string = 'Support de paie'; // Label du bouton

  // Les filtres et données du tableau sont également des inputs
  @Input() data: any[] = []; // Données dynamiques du tableau

  // Filtres
  filters = {
    search: '',
    status: '',
    amountRange: [0, 10000],
    date: '',
  };

  // Fonction pour réinitialiser les filtres
  resetFilters() {
    this.filters = {
      search: '',
      status: '',
      amountRange: [0, 10000],
      date: '',
    };
  }
}
