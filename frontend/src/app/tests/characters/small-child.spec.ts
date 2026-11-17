import { GameSet, GroupType } from '../../models/character';
import { SmallChild } from '../../models/characters/small-child';
import { night } from '../night';

describe('SmallChild', () => {
  const character = new SmallChild();

  it("should have the card's identity", () => {
    expect(character.id).toBe('small_child');
    expect(character.name).toBe('The Little Girl');
    expect(character.group).toBe(GroupType.Active);
    expect(character.game).toBe(GameSet.BaseGame);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(-1);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(1);
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
