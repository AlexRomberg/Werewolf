import { Component, computed, input, output } from '@angular/core';
import { LucideChevronLeft } from '@lucide/angular';

export type SidebarPanel =
  { kind: 'setup' } | { kind: 'cards' } | { kind: 'person'; personId: string };

const SidebarTitles: Record<SidebarPanel['kind'], string> = {
  setup: "Setup",
  cards: "Card selection",
  person: "Person details",
};

@Component({
  selector: 'app-sidebar',
  imports: [LucideChevronLeft],
  templateUrl: './sidebar.component.html',
  styles: ``,
  host: {
    class: 'grid grid-rows-[auto_1fr] h-full min-h-0 p-4',
  },
})
export class SidebarComponent {
  public kind = input.required<SidebarPanel['kind']>();
  public canGoBack = input(false);
  public back = output<void>();
  protected title = computed(() => SidebarTitles[this.kind()]);
}
