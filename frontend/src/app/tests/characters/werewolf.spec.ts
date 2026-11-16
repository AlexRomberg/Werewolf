import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { Werewolf } from '../../models/characters/werewolf';
import { WerewolfCharacter } from '../../models/werewolf-character';
import { night, seated } from '../night';

describe('Werewolf', () => {
  const character = new Werewolf();

  it("should have the card's identity", () => {
    expect(character.id).toBe('werewolf');
    expect(character.name).toBe('The Simple Werewolf');
    expect(character.group).toBe(GroupTypes.Wolves);
    expect(character.game).toBe(GameSets.BaseGame);
    expect(character.hasMultiple).toBe(true);
    expect(character.priority).toBe(BasePriority.Wolf + 1);
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
    expect(character.isAwakeThisNight(night(0))).toBe(true);
    expect(character.isAwakeThisNight(night(1))).toBe(true);
    expect(character.isAwakeThisNight(night(2))).toBe(true);
  });

  it('should ask for a player while nobody holds the card', () => {
    expect(character.getActions(night(0))).toContain('Assign the wolves');
    expect(character.getButtons(night(0))[0].kind).toBe('assign-card');
  });

  it('should stop asking once the card is held', () => {
    expect(character.getActions(seated(0, 1))).not.toContain('Assign the wolves');
    expect(character.getButtons(seated(0, 1)).map((button) => button.kind)).not.toContain(
      'assign-card',
    );
  });

  it('should keep asking while a wolf card is still unseated', () => {
    const oneOfThree = seated(0, 1, { cardCount: 3 });

    expect(character.getActions(oneOfThree)).toContain('Assign the wolves');
    expect(character.getButtons(oneOfThree)[0]).toMatchObject({ kind: 'assign-card', picks: 2 });
  });

  it('should stop pressing for a victim once the pack has chosen', () => {
    const chosen = seated(0, 1, { victims: [{ personId: 'anyone', byCharacterId: 'werewolf' }] });

    expect(character.getActions(chosen)).not.toContain('They have to settle on a victim');
    // The button stays so the pick can be changed or undone, but it no longer asks by itself.
    expect(character.getButtons(chosen)).toMatchObject([
      { kind: 'mark-victim', done: true, auto: false },
    ]);
  });
});
