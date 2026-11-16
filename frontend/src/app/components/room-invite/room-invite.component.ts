import { Component, computed, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { QrCodeComponent } from '../qr-code/qr-code.component';

/** How players get into the narrator's room: its code, and a QR code that leads straight there. */
@Component({
  selector: 'app-room-invite',
  imports: [QrCodeComponent],
  templateUrl: './room-invite.component.html',
  host: {
    class: 'flex flex-col items-center text-center',
  },
})
export class RoomInviteComponent {
  private document = inject(DOCUMENT);

  public code = input.required<string | null>();

  protected joinUrl = computed(() => `${this.document.location.origin}/room/${this.code()}`);
}
