import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="confirmation-dialog">
      <button class="close-btn" (click)="onCancel()">✕</button>
      
      <div class="dialog-icon">
        <div class="triangle-icon">!</div>
      </div>
      
      <h2 class="dialog-title">ATTENTION</h2>
      
      <p class="dialog-message">{{ data.message }}</p>
      
      <div class="dialog-actions">
        <button class="cancel-button" (click)="onCancel()">
          {{ data.cancelText || 'Annuler' }}
        </button>
        <button class="confirm-button" (click)="onConfirm()">
          {{ data.confirmText || 'Continuer' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 30px;
      text-align: center;
      background: white;
      border-radius: 8px;
      position: relative;
      min-width: 400px;
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      color: #5a6c7d;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #2c3e50;
    }

    .dialog-icon {
      margin-bottom: 20px;
    }

    .triangle-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto;
      background: #5a6c7d;
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;
      font-weight: bold;
      padding-bottom: 10px;
    }

    .dialog-title {
      color: #5a6c7d;
      font-size: 24px;
      font-weight: 600;
      margin: 20px 0;
      text-transform: uppercase;
      position: relative;
      display: inline-block;
    }

    .dialog-title::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 3px;
      background: #5a6c7d;
    }

    .dialog-message {
      color: #5a6c7d;
      font-size: 16px;
      margin: 25px 0 30px;
    }

    .dialog-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .cancel-button,
    .confirm-button {
      padding: 12px 35px;
      border-radius: 4px;
      border: 2px solid #5a6c7d;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-button {
      background: white;
      color: #5a6c7d;
    }

    .cancel-button:hover {
      background: #f0f0f0;
    }

    .confirm-button {
      background: white;
      color: #5a6c7d;
      border-color: #5a6c7d;
    }

    .confirm-button:hover {
      background: #5a6c7d;
      color: white;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; confirmText?: string; cancelText?: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}