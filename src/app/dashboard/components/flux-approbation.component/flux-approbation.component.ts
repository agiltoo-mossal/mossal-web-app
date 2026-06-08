import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  nom: string;
  poste: string;
  avatar: string;
}

interface Niveau {
  approbateur: User | null;
}

@Component({
  selector: 'app-flux-approbation',
  templateUrl: './flux-approbation.component.html',
  styleUrls: ['./flux-approbation.component.scss'],
})
export class FluxApprobationComponent implements OnInit {
  nombreNiveaux: number = 2;

  niveaux: Niveau[] = [];

  users: User[] = [
    {
      id: 1,
      nom: 'Khadija SARR',
      poste: 'Manager RH',
      avatar: 'assets/avatars/khadija.png',
    },
    {
      id: 2,
      nom: 'Maïté SARR',
      poste: 'Directrice Financier',
      avatar: 'assets/avatars/maite.png',
    },
    {
      id: 3,
      nom: 'Amadou DIALLO',
      poste: 'Responsable Comptable',
      avatar: 'assets/avatars/amadou.png',
    },
    {
      id: 4,
      nom: 'Fatou NDIAYE',
      poste: 'DG',
      avatar: 'assets/avatars/fatou.png',
    },
  ];

  ngOnInit(): void {
    this.initNiveaux();
  }

  initNiveaux(): void {
    this.niveaux = Array.from({ length: this.nombreNiveaux }, () => ({
      approbateur: null,
    }));
  }

  onNiveauxChange(): void {
    const current = this.niveaux.length;
    if (this.nombreNiveaux > current) {
      // Ajouter des niveaux
      for (let i = current; i < this.nombreNiveaux; i++) {
        this.niveaux.push({ approbateur: null });
      }
    } else {
      // Supprimer les niveaux en trop
      this.niveaux = this.niveaux.slice(0, this.nombreNiveaux);
    }
  }

  getNiveauSubtitle(index: number): string {
    const subtitles: { [key: number]: string } = {
      0: 'Premier niveau de validation',
      1: 'Deuxième niveau de validation',
      2: 'Troisième niveau de validation',
    };
    return subtitles[index] ?? `Niveau ${index + 1} de validation`;
  }

  getNiveauHint(index: number): string {
    if (index === 0) return 'Cet utilisateur doit valider en premier.';
    return `Cet utilisateur valide après le niveau ${index}.`;
  }

  reinitialiser(): void {
    this.nombreNiveaux = 2;
    this.initNiveaux();
  }

  enregistrer(): void {
    const parametrage = {
      nombreNiveaux: this.nombreNiveaux,
      niveaux: this.niveaux.map((n, i) => ({
        niveau: i + 1,
        approbateurId: n.approbateur?.id ?? null,
      })),
    };
    console.log('Paramétrage enregistré :', parametrage);
    // TODO: appeler le service API ici
    // this.fluxApprobationService.save(parametrage).subscribe(...)
  }
}