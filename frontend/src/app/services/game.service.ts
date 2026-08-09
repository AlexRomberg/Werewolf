import { Service, WritableSignal, computed, signal } from '@angular/core';
import { MIN_PLAYERS, State } from './state/types';
import { PeopleState } from './state/PeopleState';
@Service()
export class GameService {
  private state: WritableSignal<State> = signal<State>({
    people: [],
  });

  public readonly people = new PeopleState(this.state);

  public readonly canStart = computed(() => this.state().people.length >= MIN_PLAYERS);
}
