import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { MIN_PLAYERS } from '../services/state/types';

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
    expect(service.people.all().length).toBe(MIN_PLAYERS);
  });

  it('should be able to rename people', () => {
    service.people.rename(service.people.all()[0].id, '  Test  ');
    expect(service.people.all()[0].name).toBe('Test');
    expect(service.people.all()[1].name).toBe('');
  });

  it('should add people', () => {
    service.people.add();
    expect(service.people.all().length).toBe(MIN_PLAYERS + 1);
  });

  it('should remove people', () => {
    service.people.remove(service.people.all()[0].id);
    expect(service.people.all().length).toBe(MIN_PLAYERS - 1);
  });

  it('should not be able to start below five players', () => {
    service.people.remove(service.people.all()[0].id);
    expect(service.canStart()).toBe(false);
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
});
