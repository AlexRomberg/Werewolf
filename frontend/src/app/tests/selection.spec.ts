import { ActionButton, ActionCard, TONE_BY_KIND } from '../models/actions/action';
import { activeButton, isStayingHome, pickWarning } from '../models/actions/selection';
import { Cupid } from '../models/characters/cupid';
import { Seer } from '../models/characters/seer';
import { Werewolf } from '../models/characters/werewolf';
import { Witch } from '../models/characters/witch';
import { PlayerStatus } from '../services/state/types';
import { night, person, seated } from './night';

const card = (buttons: ActionButton[]): ActionCard => ({
  key: '0:card',
  id: 'card',
  title: 'Card',
  image: '',
  actions: [],
  buttons,
});

const button = (kind: ActionButton['kind']): ActionButton => ({ kind, label: kind, picks: 1 });

describe('activeButton', () => {
  const cupid = new Cupid();
  const witch = new Witch();

  it('should start with the first ability that starts by itself', () => {
    expect(activeButton(card(cupid.getButtons(night(0))), null)?.kind).toBe('assign-card');
  });

  it('should move on to the next ability once the first is done', () => {
    expect(activeButton(card(cupid.getButtons(seated(0, 1))), null)?.kind).toBe('pair-lovers');
  });

  it('should not start anything on a card without picking buttons', () => {
    expect(activeButton(card([{ kind: 'infect', label: 'Infect' }]), null)).toBeUndefined();
    expect(activeButton(undefined, null)).toBeUndefined();
  });

  it('should leave the potions of the Witch alone until one is pressed', () => {
    const potions = card(witch.getButtons(seated(0, 1)));

    expect(activeButton(potions, null)).toBeUndefined();
    expect(activeButton(potions, { cardKey: potions.key, kind: 'poison' })?.kind).toBe('poison');
  });

  it('should stay closed for the card the narrator closed it on', () => {
    const buttons = card(cupid.getButtons(night(0)));

    expect(activeButton(buttons, { cardKey: buttons.key, kind: null })).toBeUndefined();
  });

  it('should forget a choice made on another card', () => {
    const buttons = card(cupid.getButtons(night(0)));

    expect(activeButton(buttons, { cardKey: '0:other', kind: null })?.kind).toBe('assign-card');
  });

  it('should carry on by itself once the pressed ability is used up', () => {
    const afterAssigning = card(cupid.getButtons(seated(0, 1)));
    const choice = { cardKey: afterAssigning.key, kind: 'assign-card' as const };

    expect(activeButton(afterAssigning, choice)?.kind).toBe('pair-lovers');
  });
});

describe('pickWarning', () => {
  it('should let an ordinary pick through without a word', () => {
    for (const kind of ['assign-card', 'mark-victim', 'protect', 'poison', 'enchant'] as const) {
      expect(pickWarning(button(kind), 'card', person(), night())).toBeUndefined();
    }
  });

  it('should question a dead player, whatever the ability', () => {
    const dead = person({ statuses: [PlayerStatus.Dead] });

    expect(pickWarning(button('mark-victim'), 'werewolf', dead, night())).toContain('dead');
  });

  it('should question taking a card away from a seated player', () => {
    const seer = person({ character: new Seer() });

    expect(pickWarning(button('assign-card'), 'cupid', seer, night())).toContain('The Seer');
    expect(pickWarning(button('assign-card'), 'seer', seer, night())).toContain('already holds');
  });

  it('should question protecting the same player two nights running', () => {
    const anna = person();
    const context = night(1, { roles: { ...night().roles, healerLastProtected: anna.id } });

    expect(pickWarning(button('protect'), 'healer', anna, context)).toContain('last night');
    expect(pickWarning(button('protect'), 'healer', person(), context)).toBeUndefined();
  });

  it('should question the Hoodrat returning to the same host', () => {
    const host = person();
    const context = night(1, { roles: { ...night().roles, hoodratLastHost: host.id } });

    expect(pickWarning(button('sleepover'), 'hoodrat', host, context)).toContain('last night');
  });

  it('should question a role picking its own holder', () => {
    const holder = person();
    const context = night(0, { assigned: [holder] });

    expect(pickWarning(button('set-role-model'), 'wild_child', holder, context)).toBeDefined();
    expect(pickWarning(button('enchant'), 'piper', holder, context)).toBeDefined();
  });

  it('should question enchanting someone who already is', () => {
    const enchanted = person({ statuses: [PlayerStatus.Enchanted] });

    expect(pickWarning(button('enchant'), 'piper', enchanted, night())).toContain('enchanted');
  });

  it('should question healing a player the wolves left alone', () => {
    const victim = person();
    const context = night(0, { victims: [{ personId: victim.id, byCharacterId: 'werewolf' }] });

    expect(pickWarning(button('heal'), 'witch', victim, context)).toBeUndefined();
    expect(pickWarning(button('heal'), 'witch', person(), context)).toContain('wolves');
  });

  it('should not count the poison of the Witch as an attack to heal', () => {
    const poisoned = person();
    const context = night(0, { victims: [{ personId: poisoned.id, byCharacterId: 'witch' }] });

    expect(pickWarning(button('heal'), 'witch', poisoned, context)).toContain('wolves');
  });

  it('should ask before the White Wolf kills someone who is no werewolf', () => {
    const wolf = person({ character: new Werewolf() });
    const turned = person({ statuses: [PlayerStatus.TurnedWolf] });
    const villager = person({ character: new Seer() });
    const warningFor = (target: ReturnType<typeof person>) =>
      pickWarning(button('mark-victim'), 'white_wolf', target, night(1));

    expect(warningFor(wolf)).toBeUndefined();
    expect(warningFor(turned)).toBeUndefined();
    expect(warningFor(villager)).toContain('not a werewolf');
    expect(warningFor(person())).toContain('not a werewolf');
    expect(pickWarning(button('mark-victim'), 'werewolf', villager, night(1))).toBeUndefined();
  });
});

describe('isStayingHome', () => {
  it('should read the Hoodrat pointing at themself as staying home', () => {
    const hoodrat = person();
    const context = night(0, { assigned: [hoodrat] });

    expect(isStayingHome(button('sleepover'), hoodrat, context)).toBe(true);
    expect(isStayingHome(button('sleepover'), person(), context)).toBe(false);
    expect(isStayingHome(button('protect'), hoodrat, context)).toBe(false);
  });
});

describe('TONE_BY_KIND', () => {
  it('should colour abilities by what they do to a player', () => {
    expect(TONE_BY_KIND['mark-victim']).toBe(TONE_BY_KIND.poison);
    expect(TONE_BY_KIND.protect).toBe(TONE_BY_KIND.heal);
    expect(TONE_BY_KIND['pair-lovers']).toBe(TONE_BY_KIND.sleepover);
    expect(new Set(Object.values(TONE_BY_KIND)).size).toBe(6);
  });
});
