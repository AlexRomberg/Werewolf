import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-divider',
  styles: ``,
  templateUrl: './divider.component.html',
  host: {
    class: 'flex items-center gap-2.5 text-ornament',
    'aria-hidden': 'true',
  },
})
export class DividerComponent {
  public align = input<'center' | 'start'>('center');
}
