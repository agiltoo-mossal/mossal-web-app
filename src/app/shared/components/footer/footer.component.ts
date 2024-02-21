import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  weKnow: any[] = [
    {
      label: 'A propos',
      url: '#',
    },
    {
      label: 'Espaces Sénégal Services',
      url: '#',
    },
    {
      label: 'Centres d’aide',
      url: '#',
    },
    {
      label: 'Nous contacter',
      url: '#',
    },
  ];
  ressoures: any[] = [
    {
      label: 'Annuaire de l’Administration',
      url: '#',
    },
    {
      label: 'Formulaires',
      url: '#',
    },
    {
      label: 'Textes de références',
      url: '#',
    },
    {
      label: 'Modèles de lettre',
      url: '#',
    },
    {
      label: 'Foire aux questions (Faq)',
      url: '#',
    },
  ];
  ourCommitments: any[] = [
    {
      label: 'Engagements et qualité',
      url: '#',
    },
    {
      label: 'Conditions générales d’utilisation',
      url: '#',
    },
    {
      label: 'Mise à disposition des données',
      url: '#',
    },
    {
      label: 'Partenariat',
      url: '#',
    },
  ];
  others: any[] = [
    {
      label: 'Mentions légales',
      url: '#',
    },
    {
      label: 'Crédits',
      url: '#',
    },
  ];

  ourLinks: any[] = [
    {
      label: 'Presidence.sn',
      url: '#',
    },
    {
      label: 'Gouvernement.sn',
      url: '#',
    },
    {
      label: 'Assemblee-nationale.sn',
      url: '#',
    },
    {
      label: 'Inverstirausenegal.sn',
      url: '#',
    },
    {
      label: 'Sénégal Numérique SA',
      url: '#',
    },
  ];
}
