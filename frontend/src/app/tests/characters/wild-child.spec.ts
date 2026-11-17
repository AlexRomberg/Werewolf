import { BasePriority, GameSet, GroupType } from '../../models/character';
import { WildChild } from '../../models/characters/wild-child';
import { ConnectionType } from '../../services/state/types';
import { night, seated } from '../night';

describe('WildChild', () => {
  const character = new WildChild();

  it("should have the card's identity", () => {
    expect(character.id).toBe('wild_child');
    expect(character.name).toBe('The Wild Child');
    expect(character.group).toBe(GroupType.Wolves);
    expect(character.game).toBe(GameSet.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 8);
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
    expect(character.isAwakeThisNight(night(2))).toBe(false);
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

  it('should stop asking for a role model once it trusts someone', () => {
    const chosen = seated(0, 1, {
      connections: [{ type: ConnectionType.Trust, from: 'a', to: 'b' }],
    });

    expect(character.getActions(chosen)).not.toContain('Has to choose a role model');
    expect(character.getActions(chosen)).toContain('Turns into a werewolf if the role model dies');
    expect(character.getButtons(chosen)).toMatchObject([
      { kind: 'set-role-model', done: true, auto: false },
    ]);
  });
});
