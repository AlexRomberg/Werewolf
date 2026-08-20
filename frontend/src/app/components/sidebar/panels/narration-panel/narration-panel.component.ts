import { Component } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-narration-panel',
  imports: [LucideChevronLeft, LucideChevronRight, NgOptimizedImage],
  templateUrl: './narration-panel.component.html',
  styles: ``,
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class NarrationPanelComponent { }
