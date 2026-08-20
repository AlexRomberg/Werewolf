import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { WildChild } from '../../models/characters/wild-child';

describe('WildChild', () => {
  const character = new WildChild();

  it("should have the card's identity", () => {
    expect(character.id).toBe('wild_child');
    expect(character.name).toBe('The Wild Child');
    expect(character.group).toBe(GroupTypes.Wolves);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 8);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(2);
    expect(character.description[0].title).toBe('General');
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
