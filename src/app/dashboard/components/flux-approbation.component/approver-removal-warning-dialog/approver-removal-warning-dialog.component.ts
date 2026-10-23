import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ApproverRemovalWarningData {
  items: { name: string; count: number }[];
}

@Component({
  selector: 'app-approver-removal-warning-dialog',
  template: `
    <div class="warn">
      <button mat-icon-button class="close" [mat-dialog-close]="false" aria-label="Fermer">
        <mat-icon>close</mat-icon>
      </button>
      <div class="head"><mat-icon>warning</mat-icon><h2>ATTENTION</h2></div>
      <p *ngFor="let i of data.items">
        {{ i.name }} est assigné(e) à {{ i.count }} ordre{{ i.count > 1 ? 's' : '' }} en cours de validation.
      </p>
      <p class="note">
        La retirer du niveau n'affectera pas ces ordres. Elle ne sera plus disponible pour les prochains ordres.
      </p>
      <div class="btns">
        <button mat-button [mat-dialog-close]="false"><b>Annuler</b></button>
        <button mat-stroked-button [mat-dialog-close]="true">Continuer</button>
      </div>
    </div>
  `,
  styles: [`
    .warn { position: relative; border-left: 6px solid #061e5c; padding: 24px; text-align: center; color: #061e5c; }
    .head { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .head h2 { margin: 0; font-weight: 700; }
    .head mat-icon { color: #061e5c; }
    .close { position: absolute; top: 4px; right: 4px; }
    .note { font-size: 0.85rem; color: #4b5563; }
    .btns { display: flex; justify-content: center; gap: 16px; margin-top: 16px; }
  `],
})
export class ApproverRemovalWarningDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ApproverRemovalWarningData) {}
}