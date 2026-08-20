import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Healer } from '../../models/characters/healer';

describe('Healer', () => {
  const character = new Healer();

  it("should have the card's identity", () => {
    expect(character.id).toBe('healer');
    expect(character.name).toBe('The Healer');
    expect(character.group).toBe(GroupTypes.Active);
    expect(character.game).toBe(GameSets.NewMoon);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 10);
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
    expect(character.isAwakeThisNight(1)).toBe(true);
    expect(character.isAwakeThisNight(2)).toBe(true);
  });
});
