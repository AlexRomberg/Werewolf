import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { GROUP_TRANSLATIONS, GAME_SET_TRANSLATIONS, NAME_TRANSLATIONS } from '../../i18n/translations';
import { Character } from '../../models/characters/character';
import { CharacterGroup, GroupTypes, GameSets } from '../../types';
import { StateService } from '../../services/state.service';
import { I18nSelectPipe } from '@angular/common';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-cards',
  imports: [LucideAngularModule, RouterLink, I18nSelectPipe],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  grouping = signal<"group" | "game">("group");
  state = inject(StateService);
  dialog = inject(DialogService);
  NAME_TRANSLATIONS = NAME_TRANSLATIONS;

  public getCharacterGroup(): CharacterGroup[] {
    if (this.grouping() === "group") {
      return Object.values(GroupTypes).filter(v => typeof v === "number").map(type => {
        return {
          Name: GROUP_TRANSLATIONS[type],
          Cards: this.state.AllCharacters.filter((c: Character) => c.Group === type)
        }
      });
    }
    return Object.values(GameSets).filter(v => typeof v === "number").map(gameSet => {
      return {
        Name: GAME_SET_TRANSLATIONS[gameSet],
        Cards: this.state.AllCharacters.filter((c: Character) => c.Game === gameSet)
      }
    });
  }

  public openCharacter(character: Character): void {
    this.dialog.ShowCharacterDetailsDialog(character);
  }
}
