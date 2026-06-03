import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute } from '@angular/router';

interface Paiement {
  id: string;
  date: string;
  montant: string;
  statut: 'En attente' | 'Validé' | 'Rejeté';
  approbateur: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

   constructor(private router: Router,
      private route: ActivatedRoute   

   ) {}

  onImporterFichier(): void {
    this.router.navigate(['../payments/import'], { relativeTo: this.route });
  }

  onGestionManuelle(): void {
    this.router.navigate(['../payments/manual'], { relativeTo: this.route });
  }
  searchText = '';
  selectedStatut = '';
  selectedDate = '';

  paiements: Paiement[] = [
    { id: '26-001', date: '15 Mars 2026',    montant: '2 320 000 XOF', statut: 'En attente', approbateur: 'Awa Fall' },
    { id: '26-001', date: '14 Mars 2026',    montant: '950 000 XOF',   statut: 'Validé',     approbateur: 'Mamadou Diop' },
    { id: '26-001', date: '12 Mars 2026',    montant: '1 10 000 XOF',  statut: 'Rejeté',     approbateur: 'Sophia Ndiaye' },
    { id: '26-001', date: '12 Mars 2026',    montant: '748 000 XOF',   statut: 'Validé',     approbateur: 'Babacar Sylla' },
    { id: '26-001', date: '02 Mars 2026',    montant: '1 230 000 XOF', statut: 'En attente', approbateur: 'Marie Niang' },
    { id: '26-001', date: '02 Février 2026', montant: '320 000 XOF',   statut: 'Validé',     approbateur: 'Awa Fall' },
  ];

  historique = [
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
    { nom: 'Diop', prenom: 'Laurent', telephone: '77 743 34 43', montant: '120.000 XOF' },
  ];

  get filteredPaiements(): Paiement[] {
    return this.paiements.filter(p => {
      const matchSearch = !this.searchText ||
        p.approbateur.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.id.includes(this.searchText) ||
        p.montant.includes(this.searchText);
      const matchStatut = !this.selectedStatut || p.statut === this.selectedStatut;
      const matchDate = !this.selectedDate ||
        (this.selectedDate === 'mars' && p.date.includes('Mars')) ||
        (this.selectedDate === 'fevrier' && p.date.includes('Février'));
      return matchSearch && matchStatut && matchDate;
    });
  }

  reinitialiser() {
    this.searchText = '';
    this.selectedStatut = '';
    this.selectedDate = '';
  }

  ngOnInit(): void {}
}