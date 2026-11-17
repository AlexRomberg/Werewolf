import { Component, computed, input } from '@angular/core';
import { encode } from 'uqr';

const QUIET_ZONE = 2;

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
})
export class QrCodeComponent {
  public value = input.required<string>();
  public label = input($localize`:@@qrCode.label:QR code`);

  protected code = computed(() => {
    const { size, data } = encode(this.value(), { border: QUIET_ZONE, ecc: 'M' });
    const path = data
      .flatMap((row, y) => row.map((isDark, x) => (isDark ? `M${x} ${y}h1v1h-1z` : '')))
      .join('');
    return { size, path };
  });
}
