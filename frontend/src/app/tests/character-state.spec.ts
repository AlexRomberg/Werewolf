import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { INITIAL_SEATS } from '../services/state/types';
import { CHARACTERS_BY_ID, THIEF, VILLAGER, WEREWOLF } from '../models/characters';

const SEER = CHARACTERS_BY_ID.get('seer')!;

describe('CharacterState', () => {
  let game: GameService;
  let characters: GameService['characters'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    game = TestBed.inject(GameService);
    characters = game.characters;
    characters.replaceSelection([]);
  });

  describe('with the Thief', () => {
    beforeEach(() => characters.toggle(THIEF));

    it('should add the two middle cards to the deck', () => {
      expect(characters.cards().length).toBe(INITIAL_SEATS + 2);
      expect(characters.requiredVillagers()).toBe(INITIAL_SEATS + 1);
    });

    it('should not count the middle cards as cards too many', () => {
      expect(characters.excessCards()).toBe(0);

      characters.setAmount(VILLAGER, INITIAL_SEATS + 2);

      expect(characters.excessCards()).toBe(1);
    });
  });

  describe('the cards nobody holds', () => {
    const seats = () => game.people.all();

    it('should stay unknown while a seat is still empty', () => {
      characters.toggle(SEER);
      game.people.assign([seats()[0].id], SEER);

      expect(characters.leftover()).toEqual([]);
    });

    it('should be what is left of the deck once every seat holds a card', () => {
      characters.toggle(THIEF);
      game.dealShuffled(() => 0);

      expect(characters.leftover().length).toBe(2);
      expect(
        [...seats().map((seat) => seat.character!), ...characters.leftover()]
          .map((card) => card.id)
          .sort(),
      ).toEqual(
        characters
          .cards()
          .map((card) => card.id)
          .sort(),
      );
    });

    it('should follow the Thief when they swap', () => {
      characters.toggle(THIEF);
      characters.setAmount(WEREWOLF, 2);
      const ids = seats().map((seat) => seat.id);
      game.people.assign(ids.slice(0, 1), THIEF);
      game.people.assign(ids.slice(1, 2), WEREWOLF);
      game.people.assign(ids.slice(2), VILLAGER);

      expect(characters.leftover().map((card) => card.id)).toEqual(['werewolf', 'villager']);

      game.people.assign(ids.slice(0, 1), WEREWOLF);

      expect(characters.leftover().map((card) => card.id)).toEqual(['thief', 'villager']);
    });
  });

  it('should fill every seat with villagers when nothing is picked', () => {
    expect(characters.requiredVillagers()).toBe(INITIAL_SEATS);
    expect(characters.villagerCount()).toBe(INITIAL_SEATS);
    expect(characters.cards().length).toBe(INITIAL_SEATS);
  });

  it('should need one villager fewer for every card picked', () => {
    characters.toggle(SEER);
    expect(characters.requiredVillagers()).toBe(INITIAL_SEATS - 1);
    expect(characters.cards().length).toBe(INITIAL_SEATS);
  });

  it('should count bulk cards against the villagers too', () => {
    characters.setAmount(WEREWOLF, 2);
    expect(characters.amountOf(WEREWOLF)).toBe(2);
    expect(characters.requiredVillagers()).toBe(INITIAL_SEATS - 2);
    expect(characters.cards().length).toBe(INITIAL_SEATS);
  });

  it('should let the narrator add villagers beyond the seats', () => {
    characters.setAmount(VILLAGER, INITIAL_SEATS + 2);
    expect(characters.villagerCount()).toBe(INITIAL_SEATS + 2);
    expect(characters.cards().length).toBe(INITIAL_SEATS + 2);
  });

  it('should never drop below the villagers the seats demand', () => {
    characters.setAmount(VILLAGER, 1);
    expect(characters.villagerCount()).toBe(INITIAL_SEATS);
  });

  it('should keep the extra villagers when a card is picked afterwards', () => {
    characters.setAmount(VILLAGER, INITIAL_SEATS + 2);
    characters.toggle(SEER);
    expect(characters.villagerCount()).toBe(INITIAL_SEATS + 2);
  });

  it('should toggle a card in and out', () => {
    characters.toggle(SEER);
    expect(characters.selection().has(SEER.id)).toBe(true);

    characters.toggle(SEER);
    expect(characters.selection().has(SEER.id)).toBe(false);
  });

  it('should cap cards only one player can hold at one', () => {
    characters.setAmount(SEER, 3);
    expect(characters.amountOf(SEER)).toBe(1);
  });

  it('should drop a card set to zero', () => {
    characters.setAmount(WEREWOLF, 2);
    characters.setAmount(WEREWOLF, 0);
    expect(characters.selection().has(WEREWOLF.id)).toBe(false);
    expect(characters.amountOf(WEREWOLF)).toBe(0);
  });
});
