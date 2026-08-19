import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { WhiteWolf } from '../../models/characters/white-wolf';
import { WerewolfCharacter } from '../../models/werewolf-character';

describe('WhiteWolf', () => {
  const character = new WhiteWolf();

  it("should have the card's identity", () => {
    expect(character.id).toBe('white_wolf');
    expect(character.name).toBe('The White Wolf');
    expect(character.group).toBe(GroupTypes.Wolves);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Wolf + 2);
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
    expect(character.isAwakeThisNight(0)).toBe(false);
    expect(character.isAwakeThisNight(1)).toBe(true);
    expect(character.isAwakeThisNight(2)).toBe(false);
  });
});
