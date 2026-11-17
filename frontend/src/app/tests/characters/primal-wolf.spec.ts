import { BasePriority, GameSet, GroupType } from '../../models/character';
import { PrimalWolf } from '../../models/characters/primal-wolf';
import { WerewolfCharacter } from '../../models/werewolf-character';
import { WEREWOLF } from '../../models/characters';
import { PersonStatus } from '../../services/state/types';
import { night, person, seated } from '../night';

describe('PrimalWolf', () => {
  const character = new PrimalWolf();

  it("should have the card's identity", () => {
    expect(character.id).toBe('primal_wolf');
    expect(character.name).toBe('The Primal Wolf');
    expect(character.group).toBe(GroupType.Wolves);
    expect(character.game).toBe(GameSet.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Wolf + 3);
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

  it('should sleep once the infection has been used', () => {
    const spent = night(1, {
      roles: { usedAbilities: ['primal_wolf_infection'], enchantedTonight: [] },
    });

    expect(character.isAwakeThisNight(spent)).toBe(false);
  });

  it('should go back to sleep once a wolf has been eliminated', () => {
    const wolfDown = person({ statuses: [PersonStatus.Dead], character: WEREWOLF });

    expect(character.isAwakeThisNight(night(1, { people: [wolfDown] }))).toBe(false);
  });
});
