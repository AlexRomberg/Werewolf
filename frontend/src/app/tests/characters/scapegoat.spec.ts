import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Scapegoat } from '../../models/characters/scapegoat';

describe('Scapegoat', () => {
  const character = new Scapegoat();

  it("should have the card's identity", () => {
    expect(character.id).toBe('scapegoat');
    expect(character.name).toBe('The Scapegoat');
    expect(character.group).toBe(GroupTypes.Passive);
    expect(character.game).toBe(GameSets.NewMoon);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 12);
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
