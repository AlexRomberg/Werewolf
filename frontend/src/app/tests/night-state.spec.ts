import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { ConnectionType, PersonStatus } from '../services/state/types';
import { CHARACTERS_BY_ID } from '../models/characters';
import { Character } from '../models/character';

describe('NightState', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  const ids = () => service.people.all().map((person) => person.id);
  const statusesOf = (index: number) => service.people.all()[index].statuses;

  describe('victims', () => {
    it('should record which role marked a player', () => {
      service.night.markVictim(ids()[0], 'werewolf');

      expect(service.night.victims()).toEqual([{ personId: ids()[0], byCharacterId: 'werewolf' }]);
    });

    it('should let a role change its mind without touching another role', () => {
      service.night.markVictim(ids()[0], 'werewolf');
      service.night.markVictim(ids()[1], 'witch');
      service.night.markVictim(ids()[2], 'werewolf');

      expect(service.night.victims()).toEqual([
        { personId: ids()[1], byCharacterId: 'witch' },
        { personId: ids()[2], byCharacterId: 'werewolf' },
      ]);
    });

    it('should let the witch take back a kill without clearing the wolves', () => {
      service.night.markVictim(ids()[0], 'werewolf');
      service.night.markVictim(ids()[1], 'witch');
      service.night.clearVictimsOf('witch');

      expect(service.night.victims()).toEqual([{ personId: ids()[0], byCharacterId: 'werewolf' }]);
    });
  });

  describe('connections', () => {
    it('should link two people', () => {
      service.night.connect(ConnectionType.Love, ids()[0], ids()[1]);

      expect(service.night.findConnection(ConnectionType.Love)).toEqual({
        type: ConnectionType.Love,
        from: ids()[0],
        to: ids()[1],
      });
    });

    it('should keep only one connection of a type', () => {
      service.night.connect(ConnectionType.Love, ids()[0], ids()[1]);
      service.night.connect(ConnectionType.Love, ids()[2], ids()[3]);

      expect(service.night.connections().length).toBe(1);
      expect(service.night.findConnection(ConnectionType.Love)?.from).toBe(ids()[2]);
    });

    it('should keep the three types apart', () => {
      service.night.connect(ConnectionType.Love, ids()[0], ids()[1]);
      service.night.connect(ConnectionType.Trust, ids()[2], ids()[3]);
      service.night.connect(ConnectionType.Sleepover, ids()[4], ids()[0]);

      expect(service.night.connections().length).toBe(3);
    });

    it('should drop a connection again', () => {
      service.night.connect(ConnectionType.Trust, ids()[0], ids()[1]);
      service.night.disconnect(ConnectionType.Trust);

      expect(service.night.findConnection(ConnectionType.Trust)).toBeUndefined();
    });
  });

  describe('statuses', () => {
    it('should add and remove a status', () => {
      service.night.addStatus(ids()[0], PersonStatus.Protected);
      expect(statusesOf(0)).toEqual([PersonStatus.Protected]);

      service.night.removeStatus(ids()[0], PersonStatus.Protected);
      expect(statusesOf(0)).toEqual([]);
    });

    it('should not add the same status twice', () => {
      service.night.addStatus(ids()[0], PersonStatus.Dead);
      service.night.addStatus(ids()[0], PersonStatus.Dead);

      expect(statusesOf(0)).toEqual([PersonStatus.Dead]);
    });

    it('should enchant people for good but count them for tonight', () => {
      service.night.enchant([ids()[0], ids()[1]]);

      expect(statusesOf(0)).toContain(PersonStatus.Enchanted);
      expect(statusesOf(1)).toContain(PersonStatus.Enchanted);
      expect(service.night.roles().enchantedTonight).toEqual([ids()[0], ids()[1]]);
    });
  });

  describe('the primal wolf infection', () => {
    it("should turn the pack's victim into a wolf instead of killing them", () => {
      service.night.markVictim(ids()[0], 'werewolf');
      service.night.infectWolfVictim();

      expect(service.night.victims()).toEqual([]);
      expect(statusesOf(0)).toContain(PersonStatus.TurnedWolf);
      expect(service.night.roles().usedAbilities).toEqual(['primal_wolf_infection']);
    });

    it('should do nothing when the wolves have not chosen', () => {
      service.night.markVictim(ids()[0], 'witch');
      service.night.infectWolfVictim();

      expect(service.night.victims().length).toBe(1);
      expect(service.night.roles().usedAbilities).toEqual([]);
    });
  });

  describe('one-shot abilities', () => {
    it('should spend an ability once', () => {
      service.night.useAbility('witch_heal');
      service.night.useAbility('witch_heal');

      expect(service.night.roles().usedAbilities).toEqual(['witch_heal']);
    });

    it('should keep abilities apart', () => {
      service.night.useAbility('witch_heal');
      service.night.useAbility('fox_request');

      expect(service.night.roles().usedAbilities).toEqual(['witch_heal', 'fox_request']);
    });
  });

  describe('the potions of the Witch', () => {
    it('should heal without erasing that the wolves came', () => {
      service.night.markVictim(ids()[0], 'werewolf');
      service.night.heal(ids()[0]);

      expect(service.night.roles().healedTonight).toBe(ids()[0]);
      expect(service.night.roles().usedAbilities).toEqual(['witch_heal']);
      expect(service.night.victims()).toEqual([{ personId: ids()[0], byCharacterId: 'werewolf' }]);
    });

    it('should poison as a kill of its own', () => {
      service.night.markVictim(ids()[0], 'werewolf');
      service.night.poison(ids()[1], 'witch');

      expect(service.night.roles().usedAbilities).toEqual(['witch_poison']);
      expect(service.night.victims()).toEqual([
        { personId: ids()[0], byCharacterId: 'werewolf' },
        { personId: ids()[1], byCharacterId: 'witch' },
      ]);
    });
  });

  describe('taking a pick back', () => {
    it('should move the protection instead of protecting two players', () => {
      service.night.protect(ids()[0]);
      service.night.protect(ids()[1]);

      expect(statusesOf(0)).toEqual([]);
      expect(statusesOf(1)).toEqual([PersonStatus.Protected]);
    });

    it('should lift the protection altogether', () => {
      service.night.protect(ids()[0]);
      service.night.clearProtection();

      expect(statusesOf(0)).toEqual([]);
    });

    it("should replace tonight's enchantment and keep the ones of earlier nights", () => {
      service.night.addStatus(ids()[0], PersonStatus.Enchanted);
      service.night.enchant([ids()[1], ids()[2]]);
      service.night.enchant([ids()[3], ids()[4]]);

      expect(statusesOf(0)).toEqual([PersonStatus.Enchanted]);
      expect(statusesOf(1)).toEqual([]);
      expect(statusesOf(3)).toEqual([PersonStatus.Enchanted]);
      expect(service.night.roles().enchantedTonight).toEqual([ids()[3], ids()[4]]);
    });

    it("should undo tonight's enchantment", () => {
      service.night.enchant([ids()[1], ids()[2]]);
      service.night.clearEnchantment();

      expect(statusesOf(1)).toEqual([]);
      expect(service.night.roles().enchantedTonight).toEqual([]);
    });

    it('should give the healing potion back', () => {
      service.night.heal(ids()[0]);
      service.night.unheal();

      expect(service.night.roles().healedTonight).toBeUndefined();
      expect(service.night.roles().usedAbilities).toEqual([]);
    });

    it('should give the poison back without touching the victim of the wolves', () => {
      service.night.markVictim(ids()[0], 'werewolf');
      service.night.poison(ids()[1], 'witch');
      service.night.unpoison('witch');

      expect(service.night.roles().usedAbilities).toEqual([]);
      expect(service.night.victims()).toEqual([{ personId: ids()[0], byCharacterId: 'werewolf' }]);
    });
  });

  describe('seating a card', () => {
    it('should hand the card to every picked player, replacing what they held', () => {
      const [first, second] = ids();
      service.people.assign([first], CHARACTERS_BY_ID.get('seer') as Character);
      service.people.assign([first, second], CHARACTERS_BY_ID.get('werewolf') as Character);

      expect(service.people.all().map((person) => person.character?.id)).toEqual([
        'werewolf',
        'werewolf',
        undefined,
        undefined,
        undefined,
      ]);
    });
  });
});
