import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectOption } from './select-option.type';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() options: SelectOption[] = [];
  @Input() value: string;
  @Input() name: string;
  @Input() form: FormGroup;
  @Input() selectControl: FormControl;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  isOpen: boolean = false;

  ngOnInit() {
    this.initValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initValue();
  }

  initValue() {
    if(this.control) {
      this.value = this.control.value;
    }
  }

  toggleOptions(): void {
    this.isOpen = !this.isOpen;
    this.control.markAsTouched();
  }

  selectOption(option: SelectOption): void {
    this.value = option.value;
    this.isOpen = false;
    this.setValue(this.value);
    this.valueChange.emit(this.value);
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  getLabelForValue(value: string) {
    const option = this.options.find(o => o.value === value);
    return option ? option.label : "";
  }

  private setValue(value) {
    if(this.control) {
      this.control.setValue(value);
      // this.value = value;
    }
  }
  get control() {
    if(this.selectControl) {
      return this.selectControl;
    }
    else if(this.form && this.name) {
      return this.form.controls[this.name];
    }
    else {
      return null;
    }
  }
  get controlClass() {
    if(this.control && this.control.touched) {
      return this.control.valid ? 'valid' : 'invalid';
    }
    return "";
  }
}
