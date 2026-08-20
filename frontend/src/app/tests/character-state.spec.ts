import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { INITIAL_SEATS } from '../services/state/types';
import { CHARACTERS_BY_ID, VILLAGER, WEREWOLF } from '../models/characters';

const SEER = CHARACTERS_BY_ID.get('seer')!;

describe('CharacterState', () => {
  let characters: GameService['characters'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    characters = TestBed.inject(GameService).characters;
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
