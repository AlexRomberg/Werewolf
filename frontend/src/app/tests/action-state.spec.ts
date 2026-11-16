import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { ConnectionType, PersonStatus } from '../services/state/types';
import { CHARACTERS_BY_ID } from '../models/characters';
import { Character } from '../models/character';

const character = (id: string) => CHARACTERS_BY_ID.get(id) as Character;

describe('ActionState', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  const ids = () => service.actions.queue().map((card) => card.id);

  const select = (...characterIds: string[]) => {
    service.characters.replaceSelection(characterIds.map((id) => [character(id), 1]));
    service.startGame();
  };

  const assign = (index: number, characterId: string, statuses: PersonStatus[] = []) => {
    const person = service.people.all()[index];
    service.people.update(person.id, {
      ...person,
      character: character(characterId),
      statuses,
    });
  };

  const advanceTo = (id: string) => {
    while (service.actions.current()?.id !== id) {
      service.actions.next();
    }
  };

  describe('the night queue', () => {
    it('should open the first night with the rules and close it with daybreak', () => {
      expect(ids()).toEqual(['rules', 'night', 'day']);
    });

    it('should explain the rules only on the first night', () => {
      advanceTo('day');
      service.actions.next();

      expect(service.actions.round()).toBe(1);
      expect(ids()).toEqual(['night', 'day']);
    });

    it('should name the wolves in play while explaining the rules', () => {
      select('werewolf', 'white_wolf', 'seer');

      expect(service.actions.queue()[0].actions).toContain(
        'Name the wolves in play: The Simple Werewolf, The White Wolf',
      );
    });

    it('should call the roles in priority order', () => {
      select('witch', 'werewolf', 'seer', 'healer');

      expect(ids()).toEqual(['rules', 'night', 'seer', 'healer', 'werewolf', 'witch', 'day']);
    });

    it('should leave out roles that sleep through this night', () => {
      select('cupid', 'white_wolf');

      expect(ids()).toContain('cupid');
      expect(ids()).not.toContain('white_wolf');
    });

    it('should call roles that only wake on later nights', () => {
      select('white_wolf');
      advanceTo('day');
      service.actions.next();

      expect(ids()).toContain('white_wolf');
    });

    it('should carry the checklist and the buttons of a role', () => {
      select('cupid');
      const card = service.actions.queue().find((c) => c.id === 'cupid');

      expect(card?.title).toBe('The Cupid');
      expect(card?.image).toBe('img/cupid.png');
      expect(card?.actions.length).toBeGreaterThan(0);
      expect(card?.buttons.map((button) => button.kind)).toContain('pair-lovers');
    });

    it('should drop the checklist lines a role switched off tonight', () => {
      select('healer');
      const healer = () => service.actions.queue().find((card) => card.id === 'healer');

      expect(healer()?.actions).toContain('May make one player immortal for this night');
      expect(healer()?.actions).not.toContain('Is finished for this night');

      service.night.addStatus(service.people.all()[0].id, PersonStatus.Protected);

      expect(healer()?.actions).toContain('Is finished for this night');
      expect(healer()?.actions).not.toContain('May make one player immortal for this night');
    });

    it('should give every card a key that is unique within the night', () => {
      select('witch', 'werewolf', 'seer');
      const keys = service.actions.queue().map((card) => card.key);

      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe('roles whose players have died', () => {
    it('should stop calling a role once everyone holding it is dead', () => {
      assign(0, 'seer', [PersonStatus.Dead]);
      select('seer');

      expect(ids()).not.toContain('seer');
    });

    it('should keep calling a role while one of its players lives', () => {
      assign(0, 'sisters', [PersonStatus.Dead]);
      assign(1, 'sisters');
      select('sisters');

      expect(ids()).toContain('sisters');
    });

    it('should keep calling the pack even when the seated wolf is dead', () => {
      assign(0, 'werewolf', [PersonStatus.Dead]);
      select('werewolf');

      expect(ids()).toContain('werewolf');
    });

    it('should keep asking for wolves until every wolf card is seated', () => {
      service.characters.replaceSelection([[character('werewolf'), 2]]);
      service.startGame();
      const assignButton = () =>
        service.actions
          .queue()
          .find((card) => card.id === 'werewolf')
          ?.buttons.find((button) => button.kind === 'assign-card');

      expect(assignButton()?.picks).toBe(2);

      assign(0, 'werewolf');
      expect(assignButton()?.picks).toBe(1);

      assign(1, 'werewolf');
      expect(assignButton()).toBeUndefined();
    });
  });

  describe('the role on the current card', () => {
    it('should see the night through its own card', () => {
      select('seer');
      assign(0, 'seer');
      advanceTo('seer');

      expect(service.actions.currentContext()?.assigned).toEqual([service.people.all()[0]]);
      expect(service.actions.currentContext()?.cardCount).toBe(1);
    });

    it('should be nobody on the cards that belong to no role', () => {
      expect(service.actions.current()?.id).toBe('rules');
      expect(service.actions.currentContext()).toBeUndefined();
    });

    it('should forget who the Witch healed once the night is over', () => {
      service.night.heal(service.people.all()[0].id);
      advanceTo('day');
      service.actions.next();

      expect(service.night.roles().healedTonight).toBeUndefined();
    });
  });

  describe('stepping through the night', () => {
    beforeEach(() => select('seer'));

    it('should start on the first card', () => {
      expect(service.actions.index()).toBe(0);
      expect(service.actions.current()?.id).toBe('rules');
      expect(service.actions.canGoBack()).toBe(false);
    });

    it('should step forward through the queue', () => {
      service.actions.next();

      expect(service.actions.current()?.id).toBe('night');
      expect(service.actions.canGoBack()).toBe(true);
    });

    it('should step back to the card before', () => {
      service.actions.next();
      service.actions.back();

      expect(service.actions.index()).toBe(0);
      expect(service.actions.current()?.id).toBe('rules');
    });

    it('should stay on the first card when there is nothing to step back to', () => {
      service.actions.back();

      expect(service.actions.index()).toBe(0);
      expect(service.actions.round()).toBe(0);
    });

    it('should start the next night after daybreak', () => {
      advanceTo('day');
      service.actions.next();

      expect(service.actions.round()).toBe(1);
      expect(service.actions.index()).toBe(0);
      expect(service.actions.current()?.id).toBe('night');
    });

    it('should not step back into a night that is over', () => {
      advanceTo('day');
      service.actions.next();
      service.actions.back();

      expect(service.actions.round()).toBe(1);
      expect(service.actions.index()).toBe(0);
    });
  });

  describe('what a new night clears', () => {
    const nextNight = () => {
      advanceTo('day');
      service.actions.next();
    };

    it('should forget the victims of the night before', () => {
      service.night.markVictim(service.people.all()[0].id, 'werewolf');
      nextNight();

      expect(service.night.victims()).toEqual([]);
    });

    it("should lift the healer's protection", () => {
      service.night.addStatus(service.people.all()[0].id, PersonStatus.Protected);
      nextNight();

      expect(service.people.all()[0].statuses).not.toContain(PersonStatus.Protected);
    });

    it('should remember who was protected, so it cannot be repeated', () => {
      const protectedId = service.people.all()[0].id;
      service.night.addStatus(protectedId, PersonStatus.Protected);
      nextNight();

      expect(service.night.roles().healerLastProtected).toBe(protectedId);
    });

    it('should send the hoodrat home and remember the host', () => {
      const [guest, host] = service.people.all();
      service.night.connect(ConnectionType.Sleepover, guest.id, host.id);
      nextNight();

      expect(service.night.findConnection(ConnectionType.Sleepover)).toBeUndefined();
      expect(service.night.roles().hoodratLastHost).toBe(host.id);
    });

    it('should leave the couple and the role model in place', () => {
      const [a, b] = service.people.all();
      service.night.connect(ConnectionType.Love, a.id, b.id);
      service.night.connect(ConnectionType.Trust, a.id, b.id);
      nextNight();

      expect(service.night.findConnection(ConnectionType.Love)).toBeDefined();
      expect(service.night.findConnection(ConnectionType.Trust)).toBeDefined();
    });

    it('should let the piper enchant again while the enchantment itself stands', () => {
      const [a] = service.people.all();
      service.night.enchant([a.id]);
      nextNight();

      expect(service.night.roles().enchantedTonight).toEqual([]);
      expect(service.people.all()[0].statuses).toContain(PersonStatus.Enchanted);
    });

    it('should keep a spent potion spent', () => {
      service.night.useAbility('witch_heal');
      nextNight();

      expect(service.night.roles().usedAbilities).toEqual(['witch_heal']);
    });
  });

  describe('roles that run out of their ability', () => {
    const nextNight = () => {
      advanceTo('day');
      service.actions.next();
    };

    it('should keep the card of the witch for the night she empties her last potion', () => {
      select('witch');
      advanceTo('witch');

      service.night.useAbility('witch_heal');
      service.night.useAbility('witch_poison');

      expect(service.actions.current()?.id).toBe('witch');
      expect(ids()).toContain('witch');
    });

    it('should stop calling the witch from the night after', () => {
      select('witch');
      service.night.useAbility('witch_heal');
      service.night.useAbility('witch_poison');
      nextNight();

      expect(ids()).not.toContain('witch');
    });

    it('should stop calling the fox the night after it has missed', () => {
      select('fox');
      service.night.useAbility('fox_request');
      expect(ids()).toContain('fox');

      nextNight();

      expect(ids()).not.toContain('fox');
    });

    it('should send the big wolf to sleep the night after a wolf has died', () => {
      select('big_wolf', 'werewolf');
      assign(0, 'werewolf', [PersonStatus.Dead]);
      expect(ids()).toContain('big_wolf');

      nextNight();

      expect(ids()).not.toContain('big_wolf');
    });

    it('should not lose its place when the morning takes a role out of the game', () => {
      select('seer', 'werewolf');
      assign(0, 'seer');
      service.night.markVictim(service.people.all()[0].id, 'werewolf');
      advanceTo('day');

      service.daybreak.applyAll();

      expect(service.actions.current()?.id).toBe('day');
      expect(ids()).toContain('seer');
    });
  });

  describe('starting a game', () => {
    it('should put the narrator on the first card of the first night', () => {
      advanceTo('day');
      service.actions.next();
      service.startGame();

      expect(service.phase()).toBe('playing');
      expect(service.actions.round()).toBe(0);
      expect(service.actions.index()).toBe(0);
    });

    it('should wipe the night state of the game before', () => {
      const [a, b] = service.people.all();
      service.night.connect(ConnectionType.Love, a.id, b.id);
      service.night.markVictim(a.id, 'werewolf');
      service.night.useAbility('witch_heal');

      service.startGame();

      expect(service.night.connections()).toEqual([]);
      expect(service.night.victims()).toEqual([]);
      expect(service.night.roles().usedAbilities).toEqual([]);
    });
  });
});
