import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Werewolf } from '../../models/characters/werewolf';
import { WerewolfCharacter } from '../../models/werewolf-character';

describe('Werewolf', () => {
  const character = new Werewolf();

  it("should have the card's identity", () => {
    expect(character.id).toBe('werewolf');
    expect(character.name).toBe('The Simple Werewolf');
    expect(character.group).toBe(GroupTypes.Wolves);
    expect(character.game).toBe(GameSets.BaseGame);
    expect(character.hasMultiple).toBe(true);
    expect(character.priority).toBe(BasePriority.Wolf + 1);
  });

  it('should count as a werewolf role', () => {
    expect(character).toBeInstanceOf(WerewolfCharacter);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(1);
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
