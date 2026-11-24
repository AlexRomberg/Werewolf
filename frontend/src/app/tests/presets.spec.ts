import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { isPresetApplied, PRESETS, presetDeck, presetEntries } from '../models/presets';
import { CHARACTERS_BY_ID, WEREWOLF } from '../models/characters';

describe('presets', () => {
  it('should name only characters that exist', () => {
    for (const preset of PRESETS) {
      expect(() => presetEntries(preset)).not.toThrow();
    }
  });

  it('should put at least one card in every preset', () => {
    for (const preset of PRESETS) {
      expect(presetDeck(preset).length).toBeGreaterThan(0);
    }
  });

  it('should give every preset its own name', () => {
    const names = PRESETS.map((preset) => preset.name);
    expect(new Set(names).size).toBe(names.length);
  });

  describe('applying one', () => {
    let characters: GameService['characters'];

    beforeEach(() => {
      TestBed.configureTestingModule({});
      characters = TestBed.inject(GameService).characters;
    });

    it('should replace whatever was picked before', () => {
      const [first, second] = PRESETS;

      characters.replaceSelection(presetEntries(first));
      characters.replaceSelection(presetEntries(second));

      expect([...characters.selection().keys()].sort()).toEqual(Object.keys(second.cards).sort());
    });

    it('should count as applied right after it is applied', () => {
      const [preset] = PRESETS;
      characters.replaceSelection(presetEntries(preset));

      expect(isPresetApplied(preset, characters.selection())).toBe(true);
    });

    it('should no longer count as applied once an amount is changed by hand', () => {
      const [preset] = PRESETS;
      characters.replaceSelection(presetEntries(preset));
      characters.setAmount(WEREWOLF, characters.amountOf(WEREWOLF) + 1);

      expect(isPresetApplied(preset, characters.selection())).toBe(false);
    });

    it('should no longer count as applied once a card outside it is added', () => {
      const preset = PRESETS.find((candidate) => !('witch' in candidate.cards))!;
      characters.replaceSelection(presetEntries(preset));
      characters.toggle(CHARACTERS_BY_ID.get('witch')!);

      expect(isPresetApplied(preset, characters.selection())).toBe(false);
    });

    it('should count only the preset that replaced the one before', () => {
      const [first, second] = PRESETS;
      characters.replaceSelection(presetEntries(first));
      characters.replaceSelection(presetEntries(second));

      expect(isPresetApplied(first, characters.selection())).toBe(false);
      expect(isPresetApplied(second, characters.selection())).toBe(true);
    });

    it('should count no preset as applied when nothing is picked', () => {
      characters.replaceSelection([]);

      expect(PRESETS.some((preset) => isPresetApplied(preset, characters.selection()))).toBe(false);
    });

    it('should deal the deck the preset describes', () => {
      const preset = PRESETS[0];
      characters.replaceSelection(presetEntries(preset));

      for (const [character, amount] of presetEntries(preset)) {
        expect(characters.amountOf(character)).toBe(amount);
      }
    });
  });
});
