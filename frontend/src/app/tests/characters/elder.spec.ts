import { GameSet, GroupType } from '../../models/character';
import { Elder } from '../../models/characters/elder';
import { night } from '../night';

describe('Elder', () => {
  const character = new Elder();

  it("should have the card's identity", () => {
    expect(character.id).toBe('elder');
    expect(character.name).toBe('The Elder');
    expect(character.group).toBe(GroupType.Passive);
    expect(character.game).toBe(GameSet.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(-1);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(3);
    expect(character.description[0].title).toBe('General');
    for (const section of character.description) {
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it('should know which nights it is awake', () => {
    expect(character.isAwakeThisNight(night(0))).toBe(false);
    expect(character.isAwakeThisNight(night(1))).toBe(false);
    expect(character.isAwakeThisNight(night(2))).toBe(false);
  });
});
