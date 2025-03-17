import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmountUnit } from 'src/graphql/generated';
import { SnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
  @Output() settingChange = new EventEmitter<any>();
  @Input() serviceId: string;
  @Input() hideToggleService: boolean = true;
  @Input() categorie: any;
  @Input() data: any = {
    activated: true,
    AmountUnit: 'Percentage',
    amount: 0,
    refundDuration: 0,
    autoValidate: true,
  };
  settingForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private snackBarService: SnackBarService
  ) {}

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
          this._fb.control(null, [Validators.required, Validators.min(1000)])
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
        console.log('dataForm', temp);

        this.settingChange.emit({
          dataForm: temp,
          categorie: this.categorie,
          saveData: true,
        });
      } else {
        console.log('dataFormErrors', this.settingForm.errors);

        this.settingChange.emit({
          dataForm: null,
          categorie: this.categorie,
          saveData: false,
        });
        this.snackBarService.showErrorSnackBar(
          1000,
          'Veuillez remplir tous les champs obligatoires'
        );
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
    this.settingForm.patchValue({
      activated: isActive,
      amountUnit: this.settingForm.get('amountUnit').value || AmountUnit.Fixed,
      refundDuration: this.settingForm.get('refundDuration').value || 1,
      autoValidate: this.settingForm.get('autoValidate').value || true,
    });
    if (this.settingForm.get('amountUnit').value == AmountUnit.Percentage) {
      this.settingForm
        .get('amountPercentage')
        .setValue(this.settingForm.get('amountPercentage').value || 1);
    } else {
      this.settingForm
        .get('amount')
        .setValue(this.settingForm.get('amount').value || 1000);
    }
  }

  get amountUnit() {
    return this.settingForm.get('amountUnit');
  }
  get amount() {
    return this.settingForm.get('amount');
  }

  onValidationChange(isActive: boolean) {
    this.settingForm.patchValue({ autoValidate: isActive });
  }
}
