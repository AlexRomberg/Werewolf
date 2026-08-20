import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { BitterOldMan } from '../../models/characters/bitter-old-man';

describe('BitterOldMan', () => {
  const character = new BitterOldMan();

  it("should have the card's identity", () => {
    expect(character.id).toBe('bitter_old_man');
    expect(character.name).toBe('The Bitter Old Man');
    expect(character.group).toBe(GroupTypes.Loners);
    expect(character.game).toBe(GameSets.NewMoon);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 13);
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
