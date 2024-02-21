import { BaseForm } from "./base-form.class";

export abstract class BaseFormData extends BaseForm {
  abstract formData: FormData; // Assurez-vous que chaque composant enfant déclare cette propriété
  abstract requiredFields: string[];
  constructor() {
    super();
  }

  submitForm() {
    const value = this.formGroup.value;
    this.formData.set('data', JSON.stringify(value))
    if(this.isValid()) {
      this.submitFormData();
    }
  }

  update() {
    const value = this.formGroup.value;
    this.formData.set('data', JSON.stringify(value))
    if(this.isValid()) {
      this.updateFormData();
    }
  }

  isValid() {
    if(this.currentValue) {
      return true;
    }
    let valid = true;
    this.requiredFields.forEach(field => {
      if(!Boolean(this.formData.get(field))) {
        valid = false;
      }
    });
    return valid;
  }

  initForm() {
    this.initFormData();
  }

  abstract submitFormData(): any;
  abstract updateFormData(): any;
  abstract initFormData(): any;

}
