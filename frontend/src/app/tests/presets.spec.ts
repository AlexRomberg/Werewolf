import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { PRESETS, presetDeck, presetEntries } from '../models/presets';

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

    it('should deal the deck the preset describes', () => {
      const preset = PRESETS[0];
      characters.replaceSelection(presetEntries(preset));

      for (const [character, amount] of presetEntries(preset)) {
        expect(characters.amountOf(character)).toBe(amount);
      }
    });
  });
});
