import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from 'src/graphql/generated';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;

  @Input() event: Event;
  action: string = 'Créer';
  @Output() closeEventEmitter = new EventEmitter<{
    action: string;
    event: Event;
  }>();

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      id: [null],
    });
  }
  ngOnInit(): void {
    if (this.event) {
      this.eventForm.patchValue(this.event);
      this.action = 'Modifier';
    }
    this.startDate.valueChanges.subscribe({
      next: (value) => {
        if (
          new Date(value).getTime() >
          new Date(this.endDate.getRawValue()).getTime()
        ) {
          this.startDate.setErrors({ invalidDate: true });
        } else {
          this.startDate.setErrors(null);
        }
      },
    });
    this.endDate.valueChanges.subscribe({
      next: (value) => {
        if (
          new Date(value).getTime() <
          new Date(this.startDate.getRawValue()).getTime()
        ) {
          this.endDate.setErrors({ invalidDate: true });
        } else {
          this.endDate.setErrors(null);
        }
      },
    });
  }
  get startDate() {
    return this.eventForm.get('startDate');
  }
  get endDate() {
    return this.eventForm.get('endDate');
  }
  get title() {
    return this.eventForm.get('title');
  }
  onSubmit(): void {
    if (this.eventForm.valid) {
      this.closeEventEmitter.emit({
        action: this.action,
        event: this.eventForm.value,
      });
    }
  }

  cancelEvent(): void {
    this.closeEventEmitter.emit({
      action: 'cancel',
      event: this.eventForm.value,
    });
  }
}
