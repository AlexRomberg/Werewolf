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
    class:
      'flex min-h-0 flex-col bg-night-900 max-md:rounded-t-surface max-md:border-t max-md:border-night-700 max-md:px-4 max-md:pt-4 max-md:pb-[max(1rem,env(safe-area-inset-bottom))] md:h-full md:border-l md:border-night-700 md:p-5',
  },
})
export class SidebarComponent {
  public title = input.required<string | undefined>();
  public canGoBack = input(false);

  public back = output<void>();
}
