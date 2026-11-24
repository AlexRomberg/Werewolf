import { DOCUMENT, Service, computed, effect, inject, signal } from '@angular/core';
import { WEREWOLF } from '../models/characters';
import { StoredValue } from './room-storage';
import { ActionState, beginNight } from './state/action-state';
import { CharacterState } from './state/character-state';
import { DaybreakState } from './state/daybreak-state';
import { NightState } from './state/night-state';
import { PeopleState, createSeats } from './state/people-state';
import { fromSavedGame, isSavedGame, toSavedGame } from './state/saved-game';
import { Ability, INITIAL_ROLE_STATE, INITIAL_SEATS, State } from './state/types';

const UNPLAYED_GAME = {
  round: 0,
  actionIndex: 0,
  awake: [],
  appliedChanges: [],
  connections: [],
  victims: [],
  roles: INITIAL_ROLE_STATE,
} satisfies Partial<State>;

@Service()
export class GameService {
  private readonly savedGame = new StoredValue(
    inject(DOCUMENT).defaultView?.localStorage,
    'werewolf:game',
    isSavedGame,
  );

  private readonly state = signal<State>(this.restoreGame());

  readonly people = new PeopleState(this.state);
  readonly characters = new CharacterState(this.state);
  readonly actions = new ActionState(this.state);
  readonly night = new NightState(this.state);
  readonly daybreak = new DaybreakState(this.state);
  readonly phase = computed(() => this.state().phase);

  constructor() {
    effect(() => this.savedGame.write(toSavedGame(this.state())));
  }

  startGame() {
    this.state.update((state) => beginNight({ ...state, ...UNPLAYED_GAME, phase: 'playing' }));
  }

  endGame() {
    this.state.update((state) => ({
      ...state,
      ...UNPLAYED_GAME,
      phase: 'setup',
      people: state.people.map((person) => ({ ...person, character: undefined, statuses: [] })),
    }));
  }

  resetAbility(ability: Ability) {
    this.night.resetAbility(ability);
  }

  dealShuffled(random: () => number = Math.random) {
    this.people.dealOut(shuffled(this.characters.cards(), random));
  }

  private restoreGame(): State {
    const saved = this.savedGame.read();
    if (saved) {
      return fromSavedGame(saved);
    }
    return {
      ...UNPLAYED_GAME,
      phase: 'setup',
      people: createSeats(INITIAL_SEATS),
      characters: new Map([[WEREWOLF.id, { character: WEREWOLF, amount: 1 }]]),
    };
  }
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
