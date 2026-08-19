import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Witch } from '../../models/characters/witch';

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
    expect(character.description[0].title).toBe("General");
    for (const section of character.description) {
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it('should know which nights it is awake', () => {
    expect(character.isAwakeThisNight(0)).toBe(true);
    expect(character.isAwakeThisNight(1)).toBe(true);
    expect(character.isAwakeThisNight(2)).toBe(true);
  });
});
