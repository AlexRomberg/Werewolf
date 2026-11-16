import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Sisters } from '../../models/characters/sisters';
import { night, seated } from '../night';

describe('Sisters', () => {
  const character = new Sisters();

  it("should have the card's identity", () => {
    expect(character.id).toBe('sisters');
    expect(character.name).toBe('The Two Sisters');
    expect(character.group).toBe(GroupTypes.Active);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(true);
    expect(character.priority).toBe(BasePriority.Initial + 6);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(2);
    expect(character.description[0].title).toBe('General');
    for (const section of character.description) {
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it('should know which nights it is awake', () => {
    expect(character.isAwakeThisNight(night(0))).toBe(true);
    expect(character.isAwakeThisNight(night(1))).toBe(false);
    expect(character.isAwakeThisNight(night(2))).toBe(true);
  });

  it('should ask for a player while nobody holds the card', () => {
    expect(character.getActions(night(0))).toContain('Assign people');
    expect(character.getButtons(night(0))[0].kind).toBe('assign-card');
  });

  it('should stop asking once the card is held', () => {
    expect(character.getActions(seated(0, 2))).not.toContain('Assign people');
    expect(character.getButtons(seated(0, 2)).map((button) => button.kind)).not.toContain(
      'assign-card',
    );
  });

  it('should keep asking until both sisters are seated', () => {
    expect(character.getActions(seated(0, 1))).toContain('Assign people');
    expect(character.getButtons(seated(0, 1))[0].picks).toBe(1);
  });
});
