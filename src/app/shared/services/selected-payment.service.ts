import { Injectable } from '@angular/core';
import { BulkPayment } from 'src/graphql/generated';

@Injectable({ providedIn: 'root' })
export class SelectedPaymentService {
  private _payment: BulkPayment | null = null;

  set(payment: BulkPayment): void {
    this._payment = payment;
  }

  get(): BulkPayment | null {
    return this._payment;
  }
}