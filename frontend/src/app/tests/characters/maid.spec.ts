import { GameSets, GroupTypes } from '../../models/character';
import { Maid } from '../../models/characters/maid';

describe('Maid', () => {
  const character = new Maid();

  it("should have the card's identity", () => {
    expect(character.id).toBe('maid');
    expect(character.name).toBe('The Devoted Maid');
    expect(character.group).toBe(GroupTypes.Passive);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(-1);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(4);
    expect(character.description[0].title).toBe("General");
    for (const section of character.description) {
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it('should know which nights it is awake', () => {
    expect(character.isAwakeThisNight(0)).toBe(false);
    expect(character.isAwakeThisNight(1)).toBe(false);
    expect(character.isAwakeThisNight(2)).toBe(false);
  });
});
