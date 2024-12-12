import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent {
  @Output() serviceActivationChange = new EventEmitter<boolean>();
  @Output() amountTypeChange = new EventEmitter<string>();
  @Output() reimbursementChange = new EventEmitter<number>();
  @Output() validationChange = new EventEmitter<boolean>();
  @Input() categorie: any;

  onServiceActivationChange(isActive: boolean) {
    this.serviceActivationChange.emit(isActive);
  }

  onAmountTypeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.amountTypeChange.emit(value);
  }

  onReimbursementChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.reimbursementChange.emit(value);
  }

  onValidationChange(isActive: boolean) {
    this.validationChange.emit(isActive);
  }
}
