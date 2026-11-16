import { BasePriority, GameSet, GroupType } from '../../models/character';
import { Fox } from '../../models/characters/fox';
import { night, seated } from '../night';

describe('Fox', () => {
  const character = new Fox();

  it("should have the card's identity", () => {
    expect(character.id).toBe('fox');
    expect(character.name).toBe('The Fox');
    expect(character.group).toBe(GroupType.Active);
    expect(character.game).toBe(GameSet.Characters);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.Initial + 5);
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

  it('should sleep once it has missed', () => {
    const missed = night(1, { roles: { usedAbilities: ['fox_request'], enchantedTonight: [] } });

    expect(character.isAwakeThisNight(missed)).toBe(false);
  });

  it('should say on its card that it has missed', () => {
    const missed = night(1, { roles: { usedAbilities: ['fox_request'], enchantedTonight: [] } });

    expect(character.getActions(missed)).toContain(
      'Has missed and will not wake up again from tomorrow night',
    );
    expect(character.getButtons(missed).find((b) => b.kind === 'lose-fox-request')?.done).toBe(
      true,
    );
  });
});
