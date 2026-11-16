import { computed, WritableSignal } from '@angular/core';
import { WEREWOLF } from '../../models/characters';
import { Connection, ConnectionType, Ability, PlayerStatus, State } from './types';

const WITCH_ID = 'witch';

export class NightState {
  constructor(private state: WritableSignal<State>) {}

  readonly victims = computed(() => this.state().victims);
  readonly connections = computed(() => this.state().connections);
  readonly roles = computed(() => this.state().roles);

  findConnection(type: ConnectionType): Connection | undefined {
    return this.state().connections.find((connection) => connection.type === type);
  }

  markVictim(personId: string, byCharacterId: string) {
    this.state.update((state) => ({
      ...state,
      victims: [
        ...state.victims.filter((victim) => victim.byCharacterId !== byCharacterId),
        { personId, byCharacterId },
      ],
    }));
  }

  clearVictimsOf(characterId: string) {
    this.state.update((state) => ({
      ...state,
      victims: state.victims.filter((victim) => victim.byCharacterId !== characterId),
    }));
  }

  addStatus(personId: string, status: PlayerStatus) {
    this.updatePerson(personId, (statuses) =>
      statuses.includes(status) ? statuses : [...statuses, status],
    );
  }

  removeStatus(personId: string, status: PlayerStatus) {
    this.updatePerson(personId, (statuses) => statuses.filter((entry) => entry !== status));
  }

  protect(personId: string) {
    this.clearProtection();
    this.addStatus(personId, PlayerStatus.Protected);
  }

  clearProtection() {
    for (const person of this.state().people) {
      this.removeStatus(person.id, PlayerStatus.Protected);
    }
  }

  enchant(personIds: readonly string[]) {
    this.clearEnchantment();
    for (const personId of personIds) {
      this.addStatus(personId, PlayerStatus.Enchanted);
    }
    this.state.update((state) => ({
      ...state,
      roles: { ...state.roles, enchantedTonight: [...personIds] },
    }));
  }

  clearEnchantment() {
    for (const personId of this.state().roles.enchantedTonight) {
      this.removeStatus(personId, PlayerStatus.Enchanted);
    }
    this.state.update((state) => ({
      ...state,
      roles: { ...state.roles, enchantedTonight: [] },
    }));
  }

  connect(type: ConnectionType, from: string, to: string) {
    this.state.update((state) => ({
      ...state,
      connections: [
        ...state.connections.filter((connection) => connection.type !== type),
        { type, from, to },
      ],
    }));
  }

  disconnect(type: ConnectionType) {
    this.state.update((state) => ({
      ...state,
      connections: state.connections.filter((connection) => connection.type !== type),
    }));
  }

  infectWolfVictim() {
    const victim = this.state().victims.find((mark) => mark.byCharacterId === WEREWOLF.id);
    if (!victim) {
      return;
    }

    this.clearVictimsOf(WEREWOLF.id);
    this.addStatus(victim.personId, PlayerStatus.TurnedWolf);
    this.useAbility('primal_wolf_infection');
  }

  heal(personId: string) {
    this.state.update((state) => ({
      ...state,
      roles: { ...state.roles, healedTonight: personId },
    }));
    this.useAbility('witch_heal');
  }

  unheal() {
    this.state.update((state) => ({
      ...state,
      roles: { ...state.roles, healedTonight: undefined },
    }));
    this.restoreAbility('witch_heal');
  }

  poison(personId: string, byCharacterId: string) {
    this.markVictim(personId, byCharacterId);
    this.useAbility('witch_poison');
  }

  unpoison(byCharacterId: string) {
    this.clearVictimsOf(byCharacterId);
    this.restoreAbility('witch_poison');
  }

  useAbility(ability: Ability) {
    this.state.update((state) =>
      state.roles.usedAbilities.includes(ability)
        ? state
        : {
            ...state,
            roles: { ...state.roles, usedAbilities: [...state.roles.usedAbilities, ability] },
          },
    );
  }

  resetAbility(ability: Ability) {
    switch (ability) {
      case 'witch_heal':
        this.unheal();
        break;
      case 'witch_poison':
        this.unpoison(WITCH_ID);
        break;
      default:
        this.restoreAbility(ability);
    }
  }

  private restoreAbility(ability: Ability) {
    this.state.update((state) => ({
      ...state,
      roles: {
        ...state.roles,
        usedAbilities: state.roles.usedAbilities.filter((used) => used !== ability),
      },
    }));
  }

  private updatePerson(personId: string, change: (statuses: PlayerStatus[]) => PlayerStatus[]) {
    this.state.update((state) => ({
      ...state,
      people: state.people.map((person) =>
        person.id === personId ? { ...person, statuses: change(person.statuses) } : person,
      ),
    }));
  }
}
