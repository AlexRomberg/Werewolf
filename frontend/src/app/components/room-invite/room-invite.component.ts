import { Component, DOCUMENT, computed, inject, input, signal } from '@angular/core';
import { LucideCheck, LucideShare2 } from '@lucide/angular';
import { formatRoomCode } from '../../services/room-code';
import { QrCodeComponent } from '../qr-code/qr-code.component';

@Component({
  selector: 'app-room-invite',
  imports: [QrCodeComponent, LucideCheck, LucideShare2],
  templateUrl: './room-invite.component.html',
  host: {
    class: 'flex flex-col items-center text-center',
  },
})
export class RoomInviteComponent {
  private document = inject(DOCUMENT);

  public code = input.required<string | null>();
  public connected = input(true);

  protected readonly shareLabel = $localize`:@@roomInvite.share:Share link`;
  protected readonly copiedLabel = $localize`:@@roomInvite.copied:Link copied`;

  protected copied = signal(false);
  protected formattedCode = computed(() => formatRoomCode(this.code() ?? ''));
  protected joinUrl = computed(() => `${this.document.location.origin}/room/${this.code()}`);
  protected shownUrl = computed(() => `${this.document.location.host}/room/${this.code()}`);

  protected async share(): Promise<void> {
    const navigator = this.document.defaultView?.navigator;
    const url = this.joinUrl();
    if (navigator?.share) {
      await navigator.share({ url }).catch(() => undefined);
      return;
    }
    await navigator?.clipboard?.writeText(url);
    this.copied.set(true);
  }
}
