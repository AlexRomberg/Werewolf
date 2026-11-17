import { BasePriority, GameSet, GroupType } from '../../models/character';
import { Healer } from '../../models/characters/healer';
import { PersonStatus } from '../../services/state/types';
import { night, person, seated } from '../night';

describe('Healer', () => {
  const character = new Healer();

  it("should have the card's identity", () => {
    expect(character.id).toBe('healer');
    expect(character.name).toBe('The Healer');
    expect(character.group).toBe(GroupType.Active);
    expect(character.game).toBe(GameSet.NewMoon);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 10);
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

  it('should report being finished once someone is protected', () => {
    const done = seated(1, 1, { people: [person({ statuses: [PersonStatus.Protected] })] });

    expect(character.getActions(done)).toContain('Is finished for this night');
    expect(character.getActions(done)).not.toContain('May make one player immortal for this night');
    expect(character.getButtons(done)).toMatchObject([
      { kind: 'protect', done: true, auto: false },
    ]);
  });
});
