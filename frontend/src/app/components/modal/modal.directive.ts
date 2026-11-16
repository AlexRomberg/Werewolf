import { afterNextRender, Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: 'dialog[appModal]',
  exportAs: 'appModal',
  host: {
    '(click)': 'onClick($event)',
    '(close)': 'closed.emit()',
  },
})
export class ModalDirective {
  public closed = output<void>();

  private dialog = inject<ElementRef<HTMLDialogElement>>(ElementRef).nativeElement;

  constructor() {
    afterNextRender(() => this.dialog.showModal());
  }

  public close() {
    this.dialog.close();
  }

  protected onClick(event: MouseEvent) {
    // The dialog element itself is only hit outside its content: on the backdrop.
    if (event.target === this.dialog) {
      this.close();
    }
  }
}
