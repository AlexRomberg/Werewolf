import { NightContext } from './actions/context';
import { Character } from './character';
import { isAlive, Person, PlayerStatus } from '../services/state/types';

export abstract class WerewolfCharacter extends Character {
  isWerewolf(person: Person) {
    return (
      person.character instanceof WerewolfCharacter ||
      person.statuses.includes(PlayerStatus.TurnedWolf)
    );
  }

  protected hasLostAWolf(context: NightContext) {
    return context.people.some((person) => !isAlive(person) && this.isWerewolf(person));
  }
}
