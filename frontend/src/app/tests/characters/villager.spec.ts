import { GameSets, GroupTypes } from '../../models/character';
import { Villager } from '../../models/characters/villager';

describe('Villager', () => {
  const character = new Villager();

  it("should have the card's identity", () => {
    expect(character.id).toBe('villager');
    expect(character.name).toBe('The Simple Villager');
    expect(character.group).toBe(GroupTypes.Passive);
    expect(character.game).toBe(GameSets.BaseGame);
    expect(character.hasMultiple).toBe(true);
    expect(character.priority).toBe(-1);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(1);
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
