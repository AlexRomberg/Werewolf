import { Service, WritableSignal, computed, signal } from '@angular/core';
import { Ability, INITIAL_ROLE_STATE, State } from './state/types';
import { PeopleState } from './state/PeopleState';
import { CharacterState } from './state/CharacterState';
import { ActionState, beginNight } from './state/ActionState';
import { DaybreakState } from './state/DaybreakState';
import { NightState } from './state/NightState';

const UNPLAYED: Pick<
  State,
  'round' | 'actionIndex' | 'awake' | 'connections' | 'victims' | 'roles' | 'appliedChanges'
> = {
  round: 0,
  actionIndex: 0,
  awake: [],
  appliedChanges: [],
  connections: [],
  victims: [],
  roles: INITIAL_ROLE_STATE,
};

@Service()
export class GameService {
  private state: WritableSignal<State> = signal<State>({
    ...UNPLAYED,
    phase: 'setup',
    people: [],
    characters: new Map(),
  });

  public readonly people = new PeopleState(this.state);
  public readonly characters = new CharacterState(this.state);
  public readonly actions = new ActionState(this.state);
  public readonly night = new NightState(this.state);
  public readonly daybreak = new DaybreakState(this.state);
  public readonly phase = computed(() => this.state().phase);

  setPhase(phase: State['phase']) {
    this.state.update((state) => ({ ...state, phase }));
  }

  startGame() {
    this.state.update((state) => beginNight({ ...state, ...UNPLAYED, phase: 'playing' }));
  }

  resetAbility(ability: Ability) {
    this.night.resetAbility(ability);
    this.actions.wakeRestoredRoles();
  }

  endGame() {
    this.state.update((state) => ({
      ...state,
      ...UNPLAYED,
      phase: 'setup',
      people: state.people.map((person) => ({ ...person, character: undefined, statuses: [] })),
    }));
  }
}
