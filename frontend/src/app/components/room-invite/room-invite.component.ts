import { Component, DOCUMENT, computed, inject, input } from '@angular/core';
import { formatRoomCode } from '../../services/room-storage';
import { QrCodeComponent } from '../qr-code/qr-code.component';

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
  public connected = input(true);

  protected formattedCode = computed(() => formatRoomCode(this.code() ?? ''));
  protected joinUrl = computed(() => `${this.document.location.origin}/room/${this.code()}`);
}
