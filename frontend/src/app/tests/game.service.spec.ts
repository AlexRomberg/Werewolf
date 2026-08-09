import { TestBed } from '@angular/core/testing';

import { GameService, MIN_PLAYERS } from '../services/game.service';

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
    expect(service.people().length).toBe(MIN_PLAYERS);
  });

  it('should be able to rename people', () => {
    service.renamePerson(service.people()[0].id, '  Test  ');
    expect(service.people()[0].name).toBe('Test');
    expect(service.people()[1].name).toBe('');
  });

  it('should add people', () => {
    service.addPerson();
    expect(service.people().length).toBe(MIN_PLAYERS + 1);
  });

  it('should remove people', () => {
    service.removePerson(service.people()[0].id);
    expect(service.people().length).toBe(MIN_PLAYERS - 1);
  });

  it('should not be able to start below five players', () => {
    service.removePerson(service.people()[0].id);
    expect(service.canStart()).toBe(false);
  });
});
