import { BasePriority, GameSet, GroupType } from '../../models/character';
import { Hoodrat } from '../../models/characters/hoodrat';
import { ConnectionType } from '../../services/state/types';
import { night, seated } from '../night';

describe('Hoodrat', () => {
  const character = new Hoodrat();

  it("should have the card's identity", () => {
    expect(character.id).toBe('hoodrat');
    expect(character.name).toBe('The Hoodrat');
    expect(character.group).toBe(GroupType.Active);
    expect(character.game).toBe(GameSet.Special);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 11);
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

  it('should report being finished once it has a host', () => {
    const away = seated(1, 1, {
      connections: [{ type: ConnectionType.Sleepover, from: 'a', to: 'b' }],
    });

    expect(character.getActions(away)).toContain('Is finished for this night');
    expect(character.getActions(away)).not.toContain('May look for a new home for the night');
    expect(character.getButtons(away)).toMatchObject([
      { kind: 'sleepover', done: true, auto: false },
    ]);
  });
});
