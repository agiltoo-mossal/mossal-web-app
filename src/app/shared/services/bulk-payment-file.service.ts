import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BulkPaymentFileService {
  private _file: File | null = null;

  set(file: File): void {
    this._file = file;
  }

  take(): File | null {
    const file = this._file;
    this._file = null;
    return file;
  }
}
