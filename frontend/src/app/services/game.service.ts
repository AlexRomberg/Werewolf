import { Service, computed, signal } from '@angular/core';
import { ActionState, beginNight } from './state/action-state';
import { CharacterState } from './state/character-state';
import { DaybreakState } from './state/daybreak-state';
import { NightState } from './state/night-state';
import { PeopleState, createSeats } from './state/people-state';
import { Ability, INITIAL_ROLE_STATE, INITIAL_SEATS, State } from './state/types';

/** Everything a game accumulates while it is played, as it is before the first night. */
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
  private readonly state = signal<State>({
    ...UNPLAYED_GAME,
    phase: 'setup',
    people: createSeats(INITIAL_SEATS),
    characters: new Map(),
  });

  readonly people = new PeopleState(this.state);
  readonly characters = new CharacterState(this.state);
  readonly actions = new ActionState(this.state);
  readonly night = new NightState(this.state);
  readonly daybreak = new DaybreakState(this.state);
  readonly phase = computed(() => this.state().phase);

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
    this.actions.wakeRestoredRoles();
  }
}
