import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { ConnectionType, INITIAL_SEATS, MAX_SEATS, PersonStatus } from '../services/state/types';
import { WEREWOLF } from '../models/characters';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with five unnamed players', () => {
    expect(service.people.all().length).toBe(INITIAL_SEATS);
  });

  it('should be able to update a person', () => {
    const person = service.people.all()[0];
    service.people.update(person.id, { ...person, name: 'Test' });
    expect(service.people.all()[0].name).toBe('Test');
    expect(service.people.all()[1].name).toBe('');
  });

  it('should add people', () => {
    service.people.add();
    expect(service.people.all().length).toBe(INITIAL_SEATS + 1);
  });

  it('should remove people', () => {
    service.people.remove(service.people.all()[0].id);
    expect(service.people.all().length).toBe(INITIAL_SEATS - 1);
  });

  it('should forget the links and marks of a player who leaves', () => {
    const [first, second, third] = service.people.all();
    service.night.connect(ConnectionType.Love, first.id, second.id);
    service.night.connect(ConnectionType.Trust, second.id, third.id);
    service.night.markVictim(first.id, 'werewolf');

    service.people.remove(first.id);

    expect(service.night.connections()).toEqual([
      { type: ConnectionType.Trust, from: second.id, to: third.id },
    ]);
    expect(service.night.victims()).toEqual([]);
  });

  describe('players as the screen shows them', () => {
    it('should number the seats and fall back to them for a name', () => {
      const [first] = service.people.all();
      service.people.update(first.id, { ...first, name: 'Anna' });

      expect(service.people.views().map((view) => view.displayName)).toEqual([
        'Anna',
        'Seat 2',
        'Seat 3',
        'Seat 4',
        'Seat 5',
      ]);
    });

    it('should tell death apart from what shows as a badge', () => {
      const [first] = service.people.all();
      service.night.addStatus(first.id, PersonStatus.Dead);
      service.night.addStatus(first.id, PersonStatus.Enchanted);

      expect(service.people.views()[0]).toMatchObject({ isDead: true, badges: ['enchanted'] });
    });

    it("should show tonight's marks without storing them on the player", () => {
      const [first, second] = service.people.all();
      service.night.markVictim(first.id, 'werewolf');
      service.night.heal(first.id);
      service.night.protect(second.id);

      expect(service.people.views()[0].badges).toEqual(['victim', 'healed']);
      expect(service.people.views()[1].badges).toEqual(['protected']);
      expect(service.people.all()[0].statuses).toEqual([]);
    });
  });

  describe('ending a game', () => {
    it('should return to setup with the table and the deck intact', () => {
      const [first] = service.people.all();
      service.people.update(first.id, { ...first, name: 'Anna' });
      service.characters.replaceSelection([[WEREWOLF, 2]]);
      service.startGame();

      service.endGame();

      expect(service.phase()).toBe('setup');
      expect(service.people.all().length).toBe(INITIAL_SEATS);
      expect(service.people.all()[0].name).toBe('Anna');
      expect(service.characters.amountOf(WEREWOLF)).toBe(2);
    });

    it('should wipe everything the game itself left behind', () => {
      const [first, second] = service.people.all();
      service.startGame();
      service.people.assign([first.id], WEREWOLF);
      service.night.addStatus(second.id, PersonStatus.Dead);
      service.night.connect(ConnectionType.Love, first.id, second.id);
      service.night.markVictim(second.id, 'werewolf');
      service.night.useAbility('witch_heal');
      service.actions.next();

      service.endGame();

      expect(service.people.all().every((p) => !p.character && p.statuses.length === 0)).toBe(true);
      expect(service.night.connections()).toEqual([]);
      expect(service.night.victims()).toEqual([]);
      expect(service.night.roles().usedAbilities).toEqual([]);
      expect(service.actions.index()).toBe(0);
      expect(service.actions.round()).toBe(0);
    });
  });

  describe('seating order', () => {
    let ids: string[];

    beforeEach(() => {
      ids = service.people.all().map((person) => person.id);
    });

    const order = () => service.people.all().map((person) => person.id);

    it('should move a person later in the seating order', () => {
      service.people.move(ids[0], 2);
      expect(order()).toEqual([ids[1], ids[2], ids[0], ids[3], ids[4]]);
    });

    it('should move a person earlier in the seating order', () => {
      service.people.move(ids[3], 1);
      expect(order()).toEqual([ids[0], ids[3], ids[1], ids[2], ids[4]]);
    });

    it('should keep the seating order when a person is dropped where they were', () => {
      service.people.move(ids[2], 2);
      expect(order()).toEqual(ids);
    });

    it('should clamp a move past the end of the circle', () => {
      service.people.move(ids[0], 99);
      expect(order()).toEqual([ids[1], ids[2], ids[3], ids[4], ids[0]]);
    });

    it('should ignore a move of someone who left the game', () => {
      service.people.move('gone', 0);
      expect(order()).toEqual(ids);
    });
  });

  describe('players joining from their devices', () => {
    const names = () => service.people.all().map((person) => person.name);

    it('should seat a player in the first unnamed seat', () => {
      const first = service.people.all()[0];
      service.people.update(first.id, { ...first, name: 'Anna' });

      const id = service.people.takeSeat('Ben');

      expect(id).toBe(service.people.all()[1].id);
      expect(names()).toEqual(['Anna', 'Ben', '', '', '']);
    });

    it('should add a seat when every seat has a name', () => {
      Array.from({ length: INITIAL_SEATS }, (_, index) => service.people.takeSeat(`P${index}`));

      const id = service.people.takeSeat('Late');

      expect(service.people.all().length).toBe(INITIAL_SEATS + 1);
      expect(service.people.all().at(-1)).toMatchObject({ id, name: 'Late' });
    });

    it('should turn a player away from a full table', () => {
      Array.from({ length: MAX_SEATS }, (_, index) => service.people.takeSeat(`P${index}`));

      expect(service.people.takeSeat('One too many')).toBeNull();
      expect(service.people.all().length).toBe(MAX_SEATS);
    });

    it('should find the free seat of a player coming back under the same name', () => {
      const annaId = service.people.takeSeat('Anna')!;

      expect(service.people.findFreeSeat(' anna ', () => false)).toBe(annaId);
      expect(service.people.findFreeSeat('Anna', (id) => id === annaId)).toBeNull();
      expect(service.people.findFreeSeat('Zoe', () => false)).toBeNull();
    });
  });

  describe('player cards', () => {
    const cardOf = (id: string) => service.people.cards().get(id)!;

    it('should show the role and what the player is', () => {
      const [anna] = service.people.all();
      service.people.assign([anna.id], WEREWOLF);
      service.people.update(anna.id, {
        ...service.people.all()[0],
        statuses: [PersonStatus.Enchanted, PersonStatus.Dead],
      });

      expect(cardOf(anna.id)).toEqual({
        characterId: WEREWOLF.id,
        isDead: true,
        isWerewolf: true,
        isEnchanted: true,
        links: [],
      });
    });

    it('should tell both lovers of each other', () => {
      const [anna, ben] = service.people.all();
      service.people.update(anna.id, { ...anna, name: 'Anna' });
      service.night.connect(ConnectionType.Love, anna.id, ben.id);

      expect(cardOf(anna.id).links).toEqual([{ type: 'love', name: 'Seat 2' }]);
      expect(cardOf(ben.id).links).toEqual([{ type: 'love', name: 'Anna' }]);
    });

    it('should tell only the wild child and the hoodrat of their link', () => {
      const [child, model, hoodrat, host] = service.people.all();
      service.night.connect(ConnectionType.Trust, child.id, model.id);
      service.night.connect(ConnectionType.Sleepover, hoodrat.id, host.id);

      expect(cardOf(child.id).links).toEqual([{ type: 'trust', name: 'Seat 2' }]);
      expect(cardOf(model.id).links).toEqual([]);
      expect(cardOf(hoodrat.id).links).toEqual([{ type: 'sleepover', name: 'Seat 4' }]);
      expect(cardOf(host.id).links).toEqual([]);
    });
  });
});
