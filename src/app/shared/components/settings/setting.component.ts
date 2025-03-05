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
  @Input() serviceId: string;
  @Input() categorie: any;
  @Input() data: any = {
    activated: true,
    AmountUnit: 'Percentage',
    amount: 0,
    refundDuration: 0,
    autoValidate: true,
  };
  settingForm: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.settingForm = this._fb.group({
      activated: [true],
      amountUnit: [AmountUnit.Percentage, [Validators.required]],
      // amount: [],
      refundDuration: [null, [Validators.required, Validators.min(1)]],
      autoValidate: [true],
      amountPercentage: [
        null,
        [Validators.min(1), Validators.max(100), Validators.required],
      ],
      // amountPercentage: [],
    });

    if (this.data) {
      if (this.data.amountUnit === 'Fixed') {
        this.settingForm.removeControl('amountPercentage');
        this.settingForm.addControl(
          'amount',
          this._fb.control(null, [Validators.required])
        );
        this.settingForm.get('amount').setValue(this.data.amount);
      } else {
        this.settingForm.removeControl('amount');

        this.settingForm.addControl(
          'amountPercentage',
          this._fb.control(null, [
            Validators.min(1),
            Validators.max(100),
            Validators.required,
          ])
        );
        this.settingForm.get('amountPercentage').setValue(this.data.amount);
      }

      this.settingForm.get('activated').setValue(this.data.activated);
      this.settingForm.get('amountUnit').setValue(this.data.amountUnit);
      this.settingForm.get('refundDuration').setValue(this.data.refundDuration);
      this.settingForm.get('autoValidate').setValue(this.data.autoValidate);

      this.settingForm.updateValueAndValidity();
    }
    this.settingForm.valueChanges.subscribe((value) => {
      if (this.settingForm.valid) {
        const temp = { ...value };
        if (value.amountUnit === AmountUnit.Percentage) {
          temp.amount = value.amountPercentage;
        }
        delete temp.amountPercentage;
        this.settingChange.emit({ dataForm: temp, categorie: this.categorie });
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
        if (this.data && this.data.amountUnit == AmountUnit.Percentage) {
          this.settingForm.get('amountPercentage').setValue(this.data.amount);
        }
      } else {
        this.settingForm.removeControl('amountPercentage');
        this.settingForm.addControl(
          'amount',
          this._fb.control(null, [Validators.required])
        );
        if (this.data && this.data.amountUnit == AmountUnit.Fixed) {
          this.settingForm.get('amount').setValue(this.data.amount);
        } else {
          this.settingForm.get('amount').setValue(null);
        }
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
