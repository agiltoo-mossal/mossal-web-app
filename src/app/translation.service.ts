import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Translation } from './translations/translation-form/translation.class';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  baseUrl = environment.API_URI;
  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  getTranslations(lang: string): Observable<Translation[]> {
    return this.http.get<Translation[]>(`${environment.API_URI}/translations?lang=${lang}`);
  }

  getSupportedLanguages() {
    return this.http.get(`${environment.API_URI}/translations/languages`);
  }

  addTranslation(translation: Translation): Observable<Translation> {
    return this.http.post<Translation>(`${this.baseUrl}/translations`, translation);
  }

  updateTranslation(id: string, translation: Translation): Observable<Translation> {
    return this.http.put<Translation>(`${this.baseUrl}/translations/${id}`, translation);
  }

  deleteTranslation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/translations/${id}`);
  }

  loadTranslations(lang: string) {
    this.getTranslations(lang).subscribe((translations) => {
      this.translate.setTranslation(lang, translations);
      this.translate.use(lang);
    });
  }

  switchLanguage() {
    const newLang = this.translate.currentLang === 'en' ? 'fr' : 'en';
    this.loadTranslations(newLang);
  }

  chooseLangue(lang: string) {
    this.loadTranslations(lang);
  }
}
