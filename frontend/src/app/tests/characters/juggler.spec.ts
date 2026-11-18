import { BasePriority, GameSet, GroupType } from '../../models/character';
import { Juggler } from '../../models/characters/juggler';
import { night, seated } from '../night';

describe('Juggler', () => {
  const character = new Juggler();

  it("should have the card's identity", () => {
    expect(character.id).toBe('juggler');
    expect(character.name).toBe('The Juggler');
    expect(character.group).toBe(GroupType.Active);
    expect(character.game).toBe(GameSet.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 2);
  });

  it('should describe the card', () => {
    expect(character.description.length).toBe(3);
    expect(character.description[0].title).toBe('General');
    for (const section of character.description) {
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it('should know which nights it is awake', () => {
    expect(character.isAwakeThisNight(night(0))).toBe(true);
    expect(character.isAwakeThisNight(night(1))).toBe(true);
    expect(character.isAwakeThisNight(night(2))).toBe(true);
  });

  it('should ask for a player while nobody holds the card', () => {
    expect(character.getActions(night(0))).toContain('Assign person');
    expect(character.getButtons(night(0))[0].kind).toBe('assign-card');
  });

  it('should stop asking once the card is held', () => {
    expect(character.getActions(seated(0, 1))).not.toContain('Assign person');
    expect(character.getButtons(seated(0, 1)).map((button) => button.kind)).not.toContain(
      'assign-card',
    );
  });

  it('should leave the choice of a role to the Juggler', () => {
    expect(character.getActions(seated(1, 1))).toContain(
      'May choose one of the displayed roles to play until the next night',
    );
  });
});
