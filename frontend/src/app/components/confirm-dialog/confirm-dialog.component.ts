import { Component, input, output } from '@angular/core';
import { ModalDirective } from '../modal/modal.directive';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ModalDirective],
  templateUrl: './confirm-dialog.component.html',
  styles: ``,
})
export class ConfirmDialogComponent {
  public title = input.required<string>();
  public message = input('');
  public confirmLabel = input('Confirm');
  public cancelLabel = input('Cancel');

  public confirmed = output<void>();
  public cancelled = output<void>();
}
