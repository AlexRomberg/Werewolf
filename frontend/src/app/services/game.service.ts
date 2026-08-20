import { Service, WritableSignal, signal } from '@angular/core';
import { State } from './state/types';
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
}
