import { GameSet, GroupType } from '../../models/character';
import { Hunter } from '../../models/characters/hunter';
import { night } from '../night';

describe('Hunter', () => {
  const character = new Hunter();

  it("should have the card's identity", () => {
    expect(character.id).toBe('hunter');
    expect(character.name).toBe('The Hunter');
    expect(character.group).toBe(GroupType.Passive);
    expect(character.game).toBe(GameSet.BaseGame);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(-1);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(2);
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
