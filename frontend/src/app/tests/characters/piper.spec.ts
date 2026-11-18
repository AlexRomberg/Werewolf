import { BasePriority, GameSet, GroupType } from '../../models/character';
import { Piper } from '../../models/characters/piper';
import { PersonStatus } from '../../services/state/types';
import { night, person, seated } from '../night';

describe('Piper', () => {
  const character = new Piper();

  it("should have the card's identity", () => {
    expect(character.id).toBe('piper');
    expect(character.name).toBe('The Piper');
    expect(character.group).toBe(GroupType.Loners);
    expect(character.game).toBe(GameSet.NewMoon);
    expect(character.hasMultiple).toBe(false);
    expect(character.priority).toBe(BasePriority.PostWolf + 2);
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

  it('should enchant only one pair a night', () => {
    const done = seated(1, 1, { roles: { usedAbilities: [], enchantedTonight: ['a', 'b'] } });

    expect(character.getButtons(done)).toMatchObject([
      { kind: 'enchant', done: true, auto: false },
    ]);
  });

  it('should wake every enchanted player after enchanting', () => {
    expect(character.getActions(seated(1, 1))).toContain(
      'Then wake all enchanted players so they recognise each other',
    );
  });

  it('should ask for fewer picks once fewer players are left to enchant', () => {
    const piper = seated(1, 1);
    const enchanted = person({ statuses: [PersonStatus.Enchanted] });
    const people = (others: ReturnType<typeof person>[]) => ({
      ...piper,
      people: [...piper.assigned, ...others],
    });
    const picks = (others: ReturnType<typeof person>[]) =>
      character.getButtons(people(others)).find((button) => button.kind === 'enchant')?.picks;

    expect(picks([person(), person(), person()])).toBe(2);
    expect(picks([person(), enchanted])).toBe(1);
    expect(picks([person({ statuses: [PersonStatus.Dead] }), person(), enchanted])).toBe(1);
  });
});
