import { LandscapeComponent } from '../../components/landscape/landscape.component';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronLeft } from '@lucide/angular';
import { CharacterDetailsComponent } from '../../components/character-details/character-details.component';
import { CharacterTileComponent } from '../../components/character-tile/character-tile.component';
import { GroupingToggleComponent } from '../../components/grouping-toggle/grouping-toggle.component';
import { Character } from '../../models/character';
import { CharacterGrouping, characterSections } from '../../models/characters/sections';

@Component({
  selector: 'app-cards',
  imports: [
    LandscapeComponent,
    RouterLink,
    LucideChevronLeft,
    CharacterTileComponent,
    CharacterDetailsComponent,
    GroupingToggleComponent,
  ],
  templateUrl: './cards.component.html',
})
export class CardsComponent {
  protected grouping = signal<CharacterGrouping>('game');
  protected sections = computed(() => characterSections(this.grouping()));
  protected describedCharacter = signal<Character | null>(null);
}
