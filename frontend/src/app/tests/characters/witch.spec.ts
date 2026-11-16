import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Witch } from '../../models/characters/witch';
import { night, seated } from '../night';

describe('Witch', () => {
  const character = new Witch();

  it("should have the card's identity", () => {
    expect(character.id).toBe('witch');
    expect(character.name).toBe('The Witch');
    expect(character.group).toBe(GroupTypes.Active);
    expect(character.game).toBe(GameSets.BaseGame);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.PostWolf + 1);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(1);
    expect(character.description[0].title).toBe('General');
    for (const section of character.description) {
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it('should know which nights it is awake', () => {
    expect(character.isAwakeThisNight(night(0))).toBe(true);
    expect(character.isAwakeThisNight(night(1))).toBe(true);
    expect(character.isAwakeThisNight(night(2))).toBe(true);
  });

  it('should ask for a player while nobody holds the card', () => {
    expect(character.getActions(night(0))).toContain('Assign person');
    expect(character.getButtons(night(0))[0].kind).toBe('assign-card');
  });

  it('should stop asking once the card is held', () => {
    expect(character.getActions(seated(0, 1))).not.toContain('Assign person');
    expect(character.getButtons(seated(0, 1)).map((button) => button.kind)).not.toContain(
      'assign-card',
    );
  });

  it('should offer only the potions it still has', () => {
    const noHeal = seated(1, 1, { roles: { usedAbilities: ['witch_heal'], enchantedTonight: [] } });

    expect(character.getActions(noHeal)).not.toContain('May use the healing potion');
    expect(character.getActions(noHeal)).toContain('May use the poison');
    expect(character.getButtons(noHeal).map((button) => button.kind)).toEqual(['poison']);
  });

  it('should wait for the narrator before picking anyone for a potion', () => {
    const potions = character.getButtons(seated(0, 1));

    expect(potions.map((button) => button.kind)).toEqual(['heal', 'poison']);
    expect(potions.every((button) => button.picks === 1 && !button.auto)).toBe(true);
  });

  it('should keep a potion used tonight on the card, so it can be taken back', () => {
    const usedTonight = seated(1, 1, {
      roles: { usedAbilities: ['witch_heal'], enchantedTonight: [], healedTonight: 'anyone' },
      victims: [{ personId: 'someone', byCharacterId: 'witch' }],
    });

    expect(character.getButtons(usedTonight)).toMatchObject([
      { kind: 'heal', done: true, auto: false },
      { kind: 'poison', done: true, auto: false },
    ]);
  });

  it('should sleep once both potions are gone', () => {
    const empty = seated(1, 1, {
      roles: { usedAbilities: ['witch_heal', 'witch_poison'], enchantedTonight: [] },
    });

    expect(character.isAwakeThisNight(empty)).toBe(false);
    expect(character.getActions(empty)).toContain('Has no potion left');
  });
});
