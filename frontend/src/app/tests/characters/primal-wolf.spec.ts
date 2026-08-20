import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { PrimalWolf } from '../../models/characters/primal-wolf';
import { WerewolfCharacter } from '../../models/werewolf-character';

describe('PrimalWolf', () => {
  const character = new PrimalWolf();

  it("should have the card's identity", () => {
    expect(character.id).toBe('primal_wolf');
    expect(character.name).toBe('The Primal Wolf');
    expect(character.group).toBe(GroupTypes.Wolves);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Wolf + 3);
  });

  it('should count as a werewolf role', () => {
    expect(character).toBeInstanceOf(WerewolfCharacter);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(1);
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
