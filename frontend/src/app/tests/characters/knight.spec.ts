import { GameSet, GroupType } from '../../models/character';
import { Knight } from '../../models/characters/knight';
import { night } from '../night';

describe('Knight', () => {
  const character = new Knight();

  it("should have the card's identity", () => {
    expect(character.id).toBe('knight');
    expect(character.name).toBe('The Knight of the Rusty Blade');
    expect(character.group).toBe(GroupType.Passive);
    expect(character.game).toBe(GameSet.Characters);
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
