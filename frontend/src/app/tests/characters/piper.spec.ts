import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Piper } from '../../models/characters/piper';

describe('Piper', () => {
  const character = new Piper();

  it("should have the card's identity", () => {
    expect(character.id).toBe('piper');
    expect(character.name).toBe('The Piper');
    expect(character.group).toBe(GroupTypes.Loners);
    expect(character.game).toBe(GameSets.NewMoon);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.PostWolf + 2);
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
    expect(character.isAwakeThisNight(1)).toBe(true);
    expect(character.isAwakeThisNight(2)).toBe(true);
  });
});
