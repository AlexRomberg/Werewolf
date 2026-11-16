import { BasePriority, GameSets, GroupTypes } from '../../models/character';
import { BigWolf } from '../../models/characters/big-wolf';
import { WerewolfCharacter } from '../../models/werewolf-character';
import { WEREWOLF } from '../../models/characters';
import { PlayerStatus } from '../../services/state/types';
import { night, person, seated } from '../night';

describe('BigWolf', () => {
  const character = new BigWolf();

  it("should have the card's identity", () => {
    expect(character.id).toBe('big_wolf');
    expect(character.name).toBe('The Big Bad Wolf');
    expect(character.group).toBe(GroupTypes.Wolves);
    expect(character.game).toBe(GameSets.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Wolf + 4);
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
    expect(character.getActions(night(0))).toContain('Assign person');
    expect(character.getButtons(night(0))[0].kind).toBe('assign-card');
  });

  it('should stop asking once the card is held', () => {
    expect(character.getActions(seated(0, 1))).not.toContain('Assign person');
    expect(character.getButtons(seated(0, 1)).map((button) => button.kind)).not.toContain(
      'assign-card',
    );
  });

  it('should go back to sleep once a wolf has been eliminated', () => {
    const wolfDown = person({ statuses: [PlayerStatus.Dead], character: WEREWOLF });

    expect(character.isAwakeThisNight(night(1, { people: [wolfDown] }))).toBe(false);
  });

  it('should keep its extra turn while the pack is whole', () => {
    const villagerDown = person({ statuses: [PlayerStatus.Dead] });

    expect(character.isAwakeThisNight(night(1, { people: [villagerDown] }))).toBe(true);
  });

  it('should offer the second victim only once', () => {
    const chosen = seated(0, 1, { victims: [{ personId: 'anyone', byCharacterId: 'big_wolf' }] });

    expect(character.getActions(chosen)).not.toContain('May pick a second victim');
    // The button stays so the pick can be changed or undone, but it no longer asks by itself.
    expect(character.getButtons(chosen)).toMatchObject([
      { kind: 'mark-victim', done: true, auto: false },
    ]);
  });
});
