import { Service, WritableSignal, computed, signal } from '@angular/core';
import { State } from './state/types';
import { PeopleState } from './state/PeopleState';
import { CharacterState } from './state/CharacterState';

@Service()
export class GameService {
  private state: WritableSignal<State> = signal<State>({
    phase: 'setup',
    people: [],
    characters: new Map(),
  });

  public readonly people = new PeopleState(this.state);
  public readonly characters = new CharacterState(this.state);
  public readonly phase = computed(() => this.state().phase);

  setPhase(phase: State['phase']) {
    this.state.update((state) => ({ ...state, phase }));
  }
}
