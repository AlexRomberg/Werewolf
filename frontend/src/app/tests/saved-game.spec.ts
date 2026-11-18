import { TestBed } from '@angular/core/testing';

import { WEREWOLF, WITCH } from '../models/characters';
import { GameService } from '../services/game.service';
import { ConnectionType, INITIAL_SEATS } from '../services/state/types';
import { MemoryStorage, useMemoryLocalStorage } from './memory-storage';

const KEY = 'werewolf:game';
let storage: MemoryStorage;

function reload() {
  TestBed.tick();
  TestBed.resetTestingModule();
  return TestBed.inject(GameService);
}

function editSave(edit: (save: Record<string, any>) => void) {
  const save = JSON.parse(storage.getItem(KEY)!);
  edit(save);
  storage.setItem(KEY, JSON.stringify(save));
}

function expectNewGame(game: GameService) {
  expect(game.phase()).toBe('setup');
  expect(game.people.all().length).toBe(INITIAL_SEATS);
  expect(game.people.all().every((person) => person.name === '')).toBe(true);
}

describe('saved game', () => {
  let game: GameService;

  beforeEach(() => {
    storage = useMemoryLocalStorage();
    game = TestBed.inject(GameService);
    const [anna, ben] = game.people.all();
    game.people.update(anna.id, { ...anna, name: 'Anna' });
    game.characters.replaceSelection([
      [WEREWOLF, 1],
      [WITCH, 1],
    ]);
    game.people.assign([anna.id], WEREWOLF);
    game.people.assign([ben.id], WITCH);
    game.startGame();
    game.night.connect(ConnectionType.Love, anna.id, ben.id);
    game.actions.next();
  });

  it('restores a game in progress after a reload', () => {
    const restored = reload();

    expect(restored.phase()).toBe('playing');
    expect(restored.people.all()).toEqual(game.people.all());
    expect(restored.characters.selection()).toEqual(game.characters.selection());
    expect(restored.night.connections()).toEqual(game.night.connections());
    expect(restored.actions.index()).toBe(1);
    expect(restored.actions.queue().map((card) => card.id)).toEqual(
      game.actions.queue().map((card) => card.id),
    );
  });

  it('rehydrates roles as the registry instances', () => {
    const restored = reload();

    expect(restored.people.all()[0].character).toBe(WEREWOLF);
    expect(restored.characters.selection().get(WITCH.id)?.character).toBe(WITCH);
  });

  it('saves characters by id, not as instances', () => {
    TestBed.tick();
    const save = JSON.parse(storage.getItem(KEY)!);

    expect(save.people[0].character).toBe(WEREWOLF.id);
    expect(save.characters).toContainEqual([WITCH.id, 1]);
  });

  it('starts a new game when the save is from another version', () => {
    TestBed.tick();
    editSave((save) => (save['version'] = 0));

    expectNewGame(reload());
  });

  it('starts a new game from a save written before the Knight and the Elder were kept', () => {
    TestBed.tick();
    editSave((save) => (save['version'] = 1));

    expectNewGame(reload());
  });

  it('starts a new game when the wound of the Knight is not a player', () => {
    TestBed.tick();
    editSave((save) => (save['roles'].knightWound = 7));

    expectNewGame(reload());
  });

  it('starts a new game when the save is unreadable', () => {
    TestBed.tick();
    storage.setItem(KEY, '{"version":1,');

    expectNewGame(reload());
  });

  it('starts a new game when the save has the wrong shape', () => {
    TestBed.tick();
    editSave((save) => delete save['roles']);

    expectNewGame(reload());
  });

  it('drops a role it no longer knows instead of failing', () => {
    TestBed.tick();
    editSave((save) => {
      save['people'][0].character = 'retired_role';
      save['characters'].push(['retired_role', 1]);
    });

    const restored = reload();

    expect(restored.phase()).toBe('playing');
    expect(restored.people.all()[0].character).toBeUndefined();
    expect(restored.characters.selection().has('retired_role')).toBe(false);
  });
});
