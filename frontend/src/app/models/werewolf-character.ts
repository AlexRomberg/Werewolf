import { NightContext } from './actions/context';
import { Character } from './character';
import { hasStatus, isAlive, Person, PersonStatus } from '../services/state/types';

export abstract class WerewolfCharacter extends Character {
  protected hasLostAWolf(context: NightContext) {
    return context.people.some((person) => !isAlive(person) && isWerewolf(person));
  }
}

export function isWerewolf(person: Person) {
  return (
    person.character instanceof WerewolfCharacter || hasStatus(person, PersonStatus.TurnedWolf)
  );
}
