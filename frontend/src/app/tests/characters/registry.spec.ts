import { CHARACTERS, CHARACTERS_BY_ID, VILLAGER } from '../../models/characters';

const EXPECTED_IDS = [
  'angel',
  'bear_tamer',
  'big_wolf',
  'bitter_old_man',
  'brothers',
  'cupid',
  'elder',
  'fox',
  'healer',
  'hoodrat',
  'hunter',
  'judge',
  'juggler',
  'knight',
  'maid',
  'piper',
  'primal_wolf',
  'scapegoat',
  'seer',
  'sisters',
  'small_child',
  'thief',
  'village_idiot',
  'villager',
  'werewolf',
  'white_wolf',
  'wild_child',
  'witch',
  'wolfdog',
];

describe('character registry', () => {
  it('should hold every role exactly once', () => {
    expect(CHARACTERS.map((character) => character.id).sort()).toEqual(EXPECTED_IDS);
  });

  it('should look every role up by id', () => {
    for (const character of CHARACTERS) {
      expect(CHARACTERS_BY_ID.get(character.id)).toBe(character);
    }
  });

  it('should expose the villager used to pad the deck', () => {
    expect(VILLAGER.id).toBe('villager');
    expect(CHARACTERS).toContain(VILLAGER);
  });

  it('should give every acting role a unique night priority', () => {
    const priorities = CHARACTERS.map((character) => character.priority).filter((p) => p >= 0);
    expect(new Set(priorities).size).toBe(priorities.length);
  });

  it('should let only acting roles wake up', () => {
    for (const character of CHARACTERS) {
      if (character.priority < 0) {
        expect([0, 1, 2].some((round) => character.isAwakeThisNight(round))).toBe(false);
      }
    }
  });

  it('should name and describe every role', () => {
    for (const character of CHARACTERS) {
      expect(character.name.length).toBeGreaterThan(0);
      expect(character.description.length).toBeGreaterThan(0);
    }
  });
});
