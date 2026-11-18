import { ANGEL, CHARACTERS, CHARACTERS_BY_ID, VILLAGER } from '../../models/characters';
import { night, seated } from '../night';

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

const ACTING_ROLES = CHARACTERS.map(
  (character) =>
    [character, [0, 1].find((round) => character.isAwakeThisNight(night(round)))] as const,
).filter(
  (entry): entry is readonly [(typeof CHARACTERS)[number], number] => entry[1] !== undefined,
);

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
        expect([0, 1, 2].some((round) => character.isAwakeThisNight(night(round)))).toBe(false);
      }
    }
  });

  it('should brief the narrator on every role that wakes up', () => {
    for (const [character, round] of ACTING_ROLES) {
      expect(character.getActions(night(round)).length).toBeGreaterThan(0);
      expect(character.getButtons(night(round)).length).toBeGreaterThan(0);
    }
  });

  it('should ask every role that wakes up to seat its players first', () => {
    for (const [character, round] of ACTING_ROLES) {
      expect(character.getButtons(night(round))[0].kind).toBe('assign-card');
    }
  });

  it('should stop asking once the role is seated', () => {
    for (const [character, round] of ACTING_ROLES) {
      const wanted = character.getButtons(night(round))[0].picks ?? 1;
      const buttons = character.getButtons(seated(round, wanted));
      expect(buttons.every((button) => button.kind !== 'assign-card')).toBe(true);
    }
  });

  it('should leave roles that never wake up without a night card', () => {
    const neverCalled = CHARACTERS.filter((c) => c.priority < 0 && c !== ANGEL);
    for (const character of neverCalled) {
      expect(character.getActions(night())).toEqual([]);
      expect(character.getButtons(night())).toEqual([]);
    }
  });

  it('should name and describe every role', () => {
    for (const character of CHARACTERS) {
      expect(character.name.length).toBeGreaterThan(0);
      expect(character.description.length).toBeGreaterThan(0);
    }
  });
});
