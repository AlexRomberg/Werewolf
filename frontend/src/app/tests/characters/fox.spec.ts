import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Fox } from '../../models/characters/fox';

describe('Fox', () => {
  const character = new Fox();

  it("should have the card's identity", () => {
    expect(character.id).toBe('fox');
    expect(character.name).toBe('The Fox');
    expect(character.group).toBe(GroupTypes.Active);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 5);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(3);
    expect(character.description[0].title).toBe('General');
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
