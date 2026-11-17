import { Component, input, output } from '@angular/core';
import { CornersComponent } from '../corners/corners.component';
import { ModalDirective } from '../modal/modal.directive';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ModalDirective, CornersComponent],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  public title = input.required<string>();
  public message = input('');
  public confirmLabel = input($localize`:@@confirm.confirm:Confirm`);
  public cancelLabel = input($localize`:@@confirm.cancel:Cancel`);
  public destructive = input(true);

  public confirmed = output<void>();
  public cancelled = output<void>();
}
