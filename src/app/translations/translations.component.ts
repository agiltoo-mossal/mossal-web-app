import { Component } from '@angular/core';
import { TranslationService } from '../translation.service';
import { Translation } from './translation-form/translation.class';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent {
  translations: Translation[] = [];
  newTranslation: Translation = new Translation(); // Instanciation d'un nouvel objet Translation
  selectedLanguage: string = 'en'; // Langue sélectionnée par défaut

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    //this.loadTranslations();
  }

  loadTranslations() {
    this.translationService.getTranslations(this.selectedLanguage).subscribe(data => {
      this.translations = data;
    });
  }

  addTranslation(translation: Translation) {
    this.translationService.addTranslation(translation).subscribe(() => {
      this.loadTranslations();
      this.newTranslation = new Translation(); // Réinitialisation du formulaire après l'ajout
    });
  }

  updateTranslation(id: string, translation: Translation) {
    this.translationService.updateTranslation(id, translation).subscribe(() => {
      this.loadTranslations();
    });
  }

  deleteTranslation(id: string) {
    this.translationService.deleteTranslation(id).subscribe(() => {
      this.loadTranslations();
    });
  }
}
