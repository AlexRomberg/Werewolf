import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { BearTamer } from '../../models/characters/bear-tamer';

describe('BearTamer', () => {
  const character = new BearTamer();

  it("should have the card's identity", () => {
    expect(character.id).toBe('bear_tamer');
    expect(character.name).toBe('The Bear Tamer');
    expect(character.group).toBe(GroupTypes.Passive);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 9);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(2);
    expect(character.description[0].title).toBe("General");
    for (const section of character.description) {
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it('should know which nights it is awake', () => {
    expect(character.isAwakeThisNight(0)).toBe(true);
    expect(character.isAwakeThisNight(1)).toBe(false);
    expect(character.isAwakeThisNight(2)).toBe(false);
  });
});
