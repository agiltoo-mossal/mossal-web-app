import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from 'src/app/translation.service';
import { Translation } from './translation.class';

@Component({
  selector: 'app-translation-form',
  templateUrl: './translation-form.component.html',
  styleUrls: ['./translation-form.component.scss']
})
export class TranslationFormComponent implements OnInit {
  @Input() translation: Translation;

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      key: ['', Validators.required],
      values: this.formBuilder.array([]) // Utilisation d'un tableau réactif pour values
    });
  }

  get valuesArray() {
    return this.formGroup.get('values') as FormArray;
  }

  addTranslation() {
    const newTranslation = this.formBuilder.group({
      lang: ['', Validators.required],
      text: ['', Validators.required]
    });

    this.valuesArray.push(newTranslation);
  }

  removeTranslation(index: number) {
    this.valuesArray.removeAt(index);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      // Transformez le formulaire en structure adaptée pour l'envoyer au service
      const translationData = {
        key: this.formGroup.value.key,
        values: this.formGroup.value.values.map((value: any) => ({
          lang: value.lang,
          text: value.text
        }))
      };

      // Envoyer la traduction au service pour l'ajouter
      this.translationService.addTranslation(translationData)
        .subscribe(newTranslation => {
          this.formGroup.reset();
        });
    }
  }

}
