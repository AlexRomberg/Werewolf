import { LandscapeComponent } from '../../components/landscape/landscape.component';
import { Component, inject, signal } from '@angular/core';
import { FormField, form, pattern, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { LucideChevronLeft } from '@lucide/angular';
import { ROOM_CODE_LENGTH } from '@protocol';
import {
  ROOM_CODE_INPUT_PATTERN,
  formatRoomCode,
  normalizeRoomCode,
} from '../../services/room-storage';

@Component({
  selector: 'app-join',
  imports: [LandscapeComponent, FormField, RouterLink, LucideChevronLeft],
  templateUrl: './join.component.html',
})
export class JoinComponent {
  private router = inject(Router);

  protected readonly placeholder = formatRoomCode('0'.repeat(ROOM_CODE_LENGTH));
  protected readonly joinForm = form(signal({ code: '' }), (path) => {
    required(path.code);
    pattern(path.code, ROOM_CODE_INPUT_PATTERN);
  });

  protected enterRoom(event: Event) {
    event.preventDefault();
    if (this.joinForm().valid()) {
      this.router.navigate(['/room', normalizeRoomCode(this.joinForm.code().value())]);
    }
  }
}
