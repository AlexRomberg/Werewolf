import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { ChangeReason, ConnectionType, PlayerStatus } from '../services/state/types';

const {
  DiedGotKilled,
  DiedOfBrokenHeart,
  DiedSleptWithVictim,
  SurvivedAttack,
  SurvivedHostDeath,
  TurnedIntoWolf,
} = ChangeReason;

describe('DaybreakState', () => {
  let service: GameService;
  let anna: string, ben: string, cleo: string, dan: string, eve: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
    [anna, ben, cleo, dan, eve] = service.people.all().map((person) => person.id);
    service.startGame();
  });

  const changes = () =>
    service.daybreak.changes().map(({ personId, reason }) => ({ personId, reason }));
  const causes = () => service.daybreak.changes().map((change) => change.causedBy);
  const statusesOf = (id: string) =>
    service.people.all().find((person) => person.id === id)?.statuses ?? [];
  const kill = (id: string) => service.night.addStatus(id, PlayerStatus.Dead);

  describe('a night without victims', () => {
    it('should bring no changes', () => {
      expect(changes()).toEqual([]);
    });

    it('should not be disturbed by links alone', () => {
      service.night.connect(ConnectionType.Love, anna, ben);
      service.night.connect(ConnectionType.Trust, cleo, dan);
      service.night.connect(ConnectionType.Sleepover, eve, anna);

      expect(changes()).toEqual([]);
    });
  });

  describe('the kill of the wolves', () => {
    it('should kill their victim', () => {
      service.night.markVictim(anna, 'werewolf');

      expect(changes()).toEqual([{ personId: anna, reason: DiedGotKilled }]);
    });

    it('should be stopped by the Healer, and still be news', () => {
      service.night.protect(anna);
      service.night.markVictim(anna, 'werewolf');

      expect(changes()).toEqual([{ personId: anna, reason: SurvivedAttack }]);
    });

    it('should be stopped by the healing potion, and still be news', () => {
      service.night.markVictim(anna, 'werewolf');
      service.night.heal(anna);

      expect(changes()).toEqual([{ personId: anna, reason: SurvivedAttack }]);
    });

    it('should not be stopped by healing somebody else', () => {
      service.night.markVictim(anna, 'werewolf');
      service.night.heal(ben);

      expect(changes()).toEqual([{ personId: anna, reason: DiedGotKilled }]);
    });

    it('should count every wolf role as the wolves', () => {
      service.night.protect(anna);
      service.night.markVictim(anna, 'big_wolf');

      expect(changes()).toEqual([{ personId: anna, reason: SurvivedAttack }]);
    });

    it('should let two wolf roles kill two players', () => {
      service.night.markVictim(anna, 'werewolf');
      service.night.markVictim(ben, 'big_wolf');

      expect(changes()).toEqual([
        { personId: anna, reason: DiedGotKilled },
        { personId: ben, reason: DiedGotKilled },
      ]);
    });

    it('should leave alone a player who is already dead', () => {
      kill(anna);
      service.night.markVictim(anna, 'werewolf');

      expect(changes()).toEqual([]);
    });
  });

  describe('the poison of the Witch', () => {
    it('should kill', () => {
      service.night.poison(anna, 'witch');

      expect(changes()).toEqual([{ personId: anna, reason: DiedGotKilled }]);
    });

    it('should not be stopped by the Healer', () => {
      service.night.protect(anna);
      service.night.poison(anna, 'witch');

      expect(changes()).toEqual([{ personId: anna, reason: DiedGotKilled }]);
    });

    it('should kill a player the wolves failed to kill, without any talk of survival', () => {
      service.night.protect(anna);
      service.night.markVictim(anna, 'werewolf');
      service.night.poison(anna, 'witch');

      expect(changes()).toEqual([{ personId: anna, reason: DiedGotKilled }]);
    });

    it('should count once for a player the wolves killed as well', () => {
      service.night.markVictim(anna, 'werewolf');
      service.night.poison(anna, 'witch');

      expect(changes()).toEqual([{ personId: anna, reason: DiedGotKilled }]);
    });
  });

  describe('the couple', () => {
    beforeEach(() => service.night.connect(ConnectionType.Love, anna, ben));

    it('should lose the partner to a broken heart, whichever of them was killed', () => {
      service.night.markVictim(ben, 'werewolf');

      expect(changes()).toEqual([
        { personId: ben, reason: DiedGotKilled },
        { personId: anna, reason: DiedOfBrokenHeart },
      ]);
    });

    it('should break a heart over a poisoning too', () => {
      service.night.poison(anna, 'witch');

      expect(changes()).toEqual([
        { personId: anna, reason: DiedGotKilled },
        { personId: ben, reason: DiedOfBrokenHeart },
      ]);
    });

    it('should stay whole when the attack is survived', () => {
      service.night.protect(anna);
      service.night.markVictim(anna, 'werewolf');

      expect(changes()).toEqual([{ personId: anna, reason: SurvivedAttack }]);
    });

    it('should count each lover once when both are victims', () => {
      service.night.markVictim(anna, 'werewolf');
      service.night.poison(ben, 'witch');

      expect(changes()).toEqual([
        { personId: anna, reason: DiedGotKilled },
        { personId: ben, reason: DiedOfBrokenHeart },
      ]);
    });

    it('should not report that a lover survived the wolves only to die of grief', () => {
      service.night.protect(anna);
      service.night.markVictim(anna, 'werewolf');
      service.night.poison(ben, 'witch');

      expect(changes()).toEqual([
        { personId: ben, reason: DiedGotKilled },
        { personId: anna, reason: DiedOfBrokenHeart },
      ]);
    });
  });

  describe('the Hoodrat sleeping over', () => {
    const hoodrat = () => eve;
    const host = () => dan;
    beforeEach(() => service.night.connect(ConnectionType.Sleepover, hoodrat(), host()));

    it('should die with a host the wolves came for', () => {
      service.night.markVictim(host(), 'werewolf');

      expect(changes()).toEqual([
        { personId: host(), reason: DiedGotKilled },
        { personId: hoodrat(), reason: DiedSleptWithVictim },
      ]);
    });

    it('should die with the host even while protected by the Healer', () => {
      service.night.protect(hoodrat());
      service.night.markVictim(host(), 'werewolf');

      expect(changes()).toContainEqual({ personId: hoodrat(), reason: DiedSleptWithVictim });
    });

    it('should live when the host survives the wolves', () => {
      service.night.protect(host());
      service.night.markVictim(host(), 'werewolf');

      expect(changes()).toEqual([{ personId: host(), reason: SurvivedAttack }]);
    });

    it('should not be reached by the poison that kills the host, and be news', () => {
      service.night.poison(host(), 'witch');

      expect(changes()).toEqual([
        { personId: host(), reason: DiedGotKilled },
        { personId: hoodrat(), reason: SurvivedHostDeath },
      ]);
      expect(service.daybreak.pending().length).toBe(1);
    });

    it('should be spared when the wolves find the house empty', () => {
      service.night.markVictim(hoodrat(), 'werewolf');

      expect(changes()).toEqual([{ personId: hoodrat(), reason: SurvivedAttack }]);
    });

    it('should be poisoned wherever they sleep, without harm to the host', () => {
      service.night.poison(hoodrat(), 'witch');

      expect(changes()).toEqual([{ personId: hoodrat(), reason: DiedGotKilled }]);
    });

    it('should not die with a host who dies of a broken heart', () => {
      service.night.connect(ConnectionType.Love, host(), anna);
      service.night.markVictim(anna, 'werewolf');

      expect(changes()).toEqual([
        { personId: anna, reason: DiedGotKilled },
        { personId: host(), reason: DiedOfBrokenHeart },
        { personId: hoodrat(), reason: SurvivedHostDeath },
      ]);
    });
  });

  describe('the Wild Child', () => {
    const child = () => cleo;
    const model = () => dan;
    beforeEach(() => service.night.connect(ConnectionType.Trust, child(), model()));

    it('should turn wolf when the role model is killed', () => {
      service.night.markVictim(model(), 'werewolf');

      expect(changes()).toEqual([
        { personId: model(), reason: DiedGotKilled },
        { personId: child(), reason: TurnedIntoWolf },
      ]);
    });

    it('should turn wolf when the role model dies of a broken heart', () => {
      service.night.connect(ConnectionType.Love, model(), anna);
      service.night.poison(anna, 'witch');

      expect(changes()).toEqual([
        { personId: anna, reason: DiedGotKilled },
        { personId: model(), reason: DiedOfBrokenHeart },
        { personId: child(), reason: TurnedIntoWolf },
      ]);
    });

    it('should stay a villager while the role model survives', () => {
      service.night.protect(model());
      service.night.markVictim(model(), 'werewolf');

      expect(changes()).toEqual([{ personId: model(), reason: SurvivedAttack }]);
    });

    it('should not turn when it dies the same night', () => {
      service.night.markVictim(model(), 'werewolf');
      service.night.poison(child(), 'witch');

      expect(changes().map((change) => change.reason)).toEqual([DiedGotKilled, DiedGotKilled]);
    });

    it('should not be affected by its own death', () => {
      service.night.markVictim(child(), 'werewolf');

      expect(changes()).toEqual([{ personId: child(), reason: DiedGotKilled }]);
    });
  });

  describe('a chain through every link', () => {
    it('should follow the wolves through host, guest, lover and role model', () => {
      // The wolves kill Dan. Eve slept at Dan's and loves Anna, who is Cleo's role model.
      service.night.connect(ConnectionType.Sleepover, eve, dan);
      service.night.connect(ConnectionType.Love, eve, anna);
      service.night.connect(ConnectionType.Trust, cleo, anna);
      service.night.markVictim(dan, 'werewolf');

      expect(changes()).toEqual([
        { personId: dan, reason: DiedGotKilled },
        { personId: eve, reason: DiedSleptWithVictim },
        { personId: anna, reason: DiedOfBrokenHeart },
        { personId: cleo, reason: TurnedIntoWolf },
      ]);
    });
  });

  describe('what caused a change', () => {
    it('should name the role that killed', () => {
      service.night.markVictim(anna, 'werewolf');
      service.night.poison(ben, 'witch');

      expect(causes()).toEqual([{ role: 'werewolf' }, { role: 'witch' }]);
    });

    it('should name the role that saved a victim', () => {
      service.night.protect(anna);
      service.night.markVictim(anna, 'werewolf');
      service.night.markVictim(ben, 'big_wolf');
      service.night.heal(ben);
      service.night.connect(ConnectionType.Sleepover, cleo, dan);
      service.night.markVictim(cleo, 'white_wolf');

      expect(causes()).toEqual([{ role: 'healer' }, { role: 'witch' }, { role: 'hoodrat' }]);
    });

    it('should name the player whose death a consequence follows', () => {
      service.night.connect(ConnectionType.Sleepover, eve, dan);
      service.night.connect(ConnectionType.Love, eve, anna);
      service.night.connect(ConnectionType.Trust, cleo, anna);
      service.night.markVictim(dan, 'werewolf');

      expect(causes()).toEqual([
        { role: 'werewolf' },
        { person: dan },
        { person: eve },
        { person: anna },
      ]);
    });
  });

  describe('applying the morning one change at a time', () => {
    const change = (index: number) => service.daybreak.changes()[index];

    beforeEach(() => {
      service.night.connect(ConnectionType.Love, anna, ben);
      service.night.connect(ConnectionType.Trust, cleo, ben);
      service.night.markVictim(anna, 'werewolf');
    });

    it('should not touch anyone before the narrator applies a change', () => {
      expect(statusesOf(anna)).toEqual([]);
      expect(service.daybreak.pending().length).toBe(3);
    });

    it('should let a single change take effect and leave the others open', () => {
      service.daybreak.apply(change(0));

      expect(statusesOf(anna)).toEqual([PlayerStatus.Dead]);
      expect(statusesOf(ben)).toEqual([]);
      expect(service.daybreak.isApplied(change(0))).toBe(true);
      expect(service.daybreak.isApplied(change(1))).toBe(false);
      expect(service.daybreak.pending().length).toBe(2);
    });

    it('should keep the whole morning in view while it is worked through', () => {
      const before = changes();
      service.daybreak.apply(change(0));
      service.daybreak.apply(change(2));

      expect(changes()).toEqual(before);
      expect(statusesOf(cleo)).toEqual([PlayerStatus.TurnedWolf]);
    });

    it('should apply a change only once', () => {
      service.daybreak.apply(change(0));
      service.daybreak.apply(change(0));

      expect(statusesOf(anna)).toEqual([PlayerStatus.Dead]);
    });

    it('should apply whatever is still open in one go', () => {
      service.daybreak.apply(change(1));
      service.daybreak.applyAll();

      expect(statusesOf(anna)).toEqual([PlayerStatus.Dead]);
      expect(statusesOf(ben)).toEqual([PlayerStatus.Dead]);
      expect(statusesOf(cleo)).toEqual([PlayerStatus.TurnedWolf]);
      expect(service.daybreak.pending()).toEqual([]);
    });

    it('should change nobody for a survived attack, yet count it as dealt with', () => {
      service.night.protect(dan);
      service.night.markVictim(dan, 'big_wolf');
      const survived = service.daybreak.changes().find((c) => c.personId === dan);

      service.daybreak.apply(survived!);

      expect(statusesOf(dan)).toEqual([PlayerStatus.Protected]);
      expect(service.daybreak.isApplied(survived!)).toBe(true);
    });

    it('should start the next night with a morning of its own', () => {
      service.daybreak.applyAll();
      while (!service.actions.isLastCard()) {
        service.actions.next();
      }
      service.actions.next();

      expect(changes()).toEqual([]);
      expect(service.daybreak.pending()).toEqual([]);
      expect(statusesOf(anna)).toEqual([PlayerStatus.Dead]);
    });
  });
});
