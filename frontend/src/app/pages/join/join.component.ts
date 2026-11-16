import { Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength, pattern, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideChevronRight } from '@lucide/angular';
import { ROOM_CODE_LENGTH, ROOM_CODE_PATTERN } from '@protocol';

@Component({
  selector: 'app-join',
  imports: [FormField, RouterLink, LucideArrowLeft, LucideChevronRight],
  templateUrl: './join.component.html',
})
export class JoinComponent {
  private router = inject(Router);

  protected readonly codeLength = ROOM_CODE_LENGTH;
  protected readonly joinForm = form(signal({ code: '' }), (path) => {
    required(path.code);
    maxLength(path.code, ROOM_CODE_LENGTH);
    pattern(path.code, ROOM_CODE_PATTERN);
  });

  protected enterRoom(event: Event) {
    event.preventDefault();
    if (this.joinForm().valid()) {
      this.router.navigate(['/room', this.joinForm.code().value()]);
    }
  }
}
