import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Brothers } from '../../models/characters/brothers';

describe('Brothers', () => {
  const character = new Brothers();

  it("should have the card's identity", () => {
    expect(character.id).toBe('brothers');
    expect(character.name).toBe('The Three Brothers');
    expect(character.group).toBe(GroupTypes.Active);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(true);
    expect(character.priority).toBe(BasePriority.Initial + 7);
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
    expect(character.isAwakeThisNight(2)).toBe(true);
  });
});
