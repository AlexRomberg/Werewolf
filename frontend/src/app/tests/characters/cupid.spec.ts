import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Cupid } from '../../models/characters/cupid';
import { ConnectionType } from '../../services/state/types';
import { night, seated } from '../night';

describe('Cupid', () => {
  const character = new Cupid();

  it("should have the card's identity", () => {
    expect(character.id).toBe('cupid');
    expect(character.name).toBe('The Cupid');
    expect(character.group).toBe(GroupTypes.Active);
    expect(character.game).toBe(GameSets.BaseGame);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 3);
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

  it('should stop asking for a couple once one is in love', () => {
    const paired = seated(0, 1, {
      connections: [{ type: ConnectionType.Love, from: 'a', to: 'b' }],
    });

    expect(character.getActions(paired)).not.toContain('Has to pick a couple');
    expect(character.getActions(paired)).toContain('The couple has to wake up');
    // The button stays so the pick can be changed or undone, but it no longer asks by itself.
    expect(character.getButtons(paired)).toMatchObject([
      { kind: 'pair-lovers', done: true, auto: false },
    ]);
  });
});
