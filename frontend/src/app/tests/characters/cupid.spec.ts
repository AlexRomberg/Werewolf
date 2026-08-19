import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Cupid } from '../../models/characters/cupid';

describe('Cupid', () => {
  const character = new Cupid();

  it("should have the card's identity", () => {
    expect(character.id).toBe('cupid');
    expect(character.name).toBe('The Cupid');
    expect(character.group).toBe(GroupTypes.Active);
    expect(character.game).toBe(GameSets.BaseGame);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 3);
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
