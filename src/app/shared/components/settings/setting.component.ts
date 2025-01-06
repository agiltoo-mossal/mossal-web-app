import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmountUnit } from 'src/graphql/generated';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
  @Output() settingChange = new EventEmitter<any>();
  @Input() categorie: any;
  @Input() data: any = {
    activated: false,
    AmountUnit: 'Percentage',
    amount: 0,
    refundDuration: 0,
    autoValidate: false,
  };
  settingForm: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.settingForm = this._fb.group({
      activated: [false],
      amountUnit: [AmountUnit.Percentage, [Validators.required]],
      // amount: [],
      refundDuration: [null, [Validators.required, Validators.min(1)]],
      autoValidate: [false],
      // amountPercentage: [],
    });
    this.settingForm.addControl(
      'amountPercentage',
      this._fb.control(null, [
        Validators.min(0),
        Validators.max(100),
        Validators.required,
      ])
    );
    if (this.data) {
      this.settingForm.patchValue({ ...this.data });
    }
    this.settingForm.valueChanges.subscribe((value) => {
      console.log('status', this.settingForm.valid);
      console.log('errors', this.settingForm.errors);

      if (this.settingForm.valid) {
        this.settingChange.emit({ dataForm: value, categorie: this.categorie });
      }
    });
    this.amountUnit.valueChanges.subscribe((value) => {
      if (value == AmountUnit.Percentage) {
        this.settingForm.removeControl('amount');
        this.settingForm.addControl(
          'amountPercentage',
          this._fb.control(null, [
            Validators.min(1),
            Validators.max(100),
            Validators.required,
          ])
        );
      } else {
        this.settingForm.removeControl('amountPercentage');
        this.settingForm.addControl(
          'amount',
          this._fb.control(null, [Validators.required])
        );
      }
    });
  }
  onServiceActivationChange(isActive: boolean) {
    this.settingForm.patchValue({ activated: isActive });
  }

  get amountUnit() {
    return this.settingForm.get('amountUnit');
  }

  onValidationChange(isActive: boolean) {
    this.settingForm.patchValue({ autoValidate: isActive });
  }
}
