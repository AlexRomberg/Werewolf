import { Service, WritableSignal, computed, signal } from '@angular/core';
import { MIN_PLAYERS, State } from './state/types';
import { PeopleState } from './state/PeopleState';
import { CharacterState } from './state/CharacterState';
@Service()
export class GameService {
  private state: WritableSignal<State> = signal<State>({
    people: [],
    characters: new Map(),
  });

  public readonly people = new PeopleState(this.state);
  public readonly characters = new CharacterState(this.state);

  public readonly canStart = computed(() => this.state().people.length >= MIN_PLAYERS);
}
