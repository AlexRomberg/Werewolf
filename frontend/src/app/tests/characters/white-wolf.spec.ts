import { BasePriority, GameSet, GroupType } from '../../models/character';
import { WhiteWolf } from '../../models/characters/white-wolf';
import { WerewolfCharacter } from '../../models/werewolf-character';
import { night, seated } from '../night';

describe('WhiteWolf', () => {
  const character = new WhiteWolf();

  it("should have the card's identity", () => {
    expect(character.id).toBe('white_wolf');
    expect(character.name).toBe('The White Wolf');
    expect(character.group).toBe(GroupType.Wolves);
    expect(character.game).toBe(GameSet.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Wolf + 2);
  });

  it('should count as a werewolf role', () => {
    expect(character).toBeInstanceOf(WerewolfCharacter);
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
    expect(character.isAwakeThisNight(night(1))).toBe(true);
    expect(character.isAwakeThisNight(night(2))).toBe(false);
  });

  it('should ask for a player while nobody holds the card', () => {
    expect(character.getActions(night(1))).toContain('Assign person');
    expect(character.getButtons(night(1))[0].kind).toBe('assign-card');
  });

  it('should stop asking once the card is held', () => {
    expect(character.getActions(seated(1, 1))).not.toContain('Assign person');
    expect(character.getButtons(seated(1, 1)).map((button) => button.kind)).not.toContain(
      'assign-card',
    );
  });

  it('should offer its kill only once a night', () => {
    const chosen = seated(1, 1, { victims: [{ personId: 'anyone', byCharacterId: 'white_wolf' }] });

    expect(character.getActions(chosen)).not.toContain('May kill one werewolf');
    // The button stays so the pick can be changed or undone, but it no longer asks by itself.
    expect(character.getButtons(chosen)).toMatchObject([
      { kind: 'mark-victim', done: true, auto: false },
    ]);
  });
});
