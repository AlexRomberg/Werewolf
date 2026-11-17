import { Component, input, output } from '@angular/core';
import { LucideChevronLeft } from '@lucide/angular';

export type SidebarPanel =
  | { kind: 'setup' }
  | { kind: 'cards' }
  | { kind: 'person'; personId: string }
  | { kind: 'narration' };

@Component({
  selector: 'app-sidebar',
  imports: [LucideChevronLeft],
  templateUrl: './sidebar.component.html',
  host: {
    class: 'grid grid-rows-[auto_1fr] h-full min-h-0 p-4',
  },
})
export class SidebarComponent {
  public title = input.required<string | undefined>();
  public canGoBack = input(false);

  public back = output<void>();
}
