import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[requiresConfirmation]',
})
export class RequiresConfirmationDirective {
  @Input() confirmCallbackParam: any;
  @Input() message: string;
  @Input() disabled: boolean = false;
  @Input() confirmCallback: Function = () => {
    // console.log('confirmed');
  };
  @Input() cancelmCallback: Function = () => {};
  @Input() reasonRequired: boolean = false;
  reason: string;
  constructor(private elemRef: ElementRef, public dialog: MatDialog) {}

  @HostListener('click')
  openDialog() {
    if (this.disabled) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '446px',
      data: { message: this.message, reasonRequired: this.reasonRequired },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true || (result && this.reasonRequired)) {
        if (this.reasonRequired) {
          this.confirmCallback(this.confirmCallbackParam, result);
        } else {
          this.confirmCallback(this.confirmCallbackParam);
        }
      } else {
        this.cancelmCallback();
      }
    });
  }
}
