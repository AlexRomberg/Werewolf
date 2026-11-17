import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-corners',
  styles: ``,
  templateUrl: './corners.component.html',
  host: {
    class: 'pointer-events-none absolute inset-0 text-ornament',
    'aria-hidden': 'true',
  },
})
export class CornersComponent {
  protected readonly corners = [
    'top-1.5 left-1.5',
    'top-1.5 right-1.5 -scale-x-100',
    'bottom-1.5 left-1.5 -scale-y-100',
    'right-1.5 bottom-1.5 -scale-100',
  ];
}
