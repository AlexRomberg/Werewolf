import { computed, WritableSignal } from '@angular/core';
import { WEREWOLF, WITCH } from '../../models/characters';
import {
  Ability,
  Connection,
  ConnectionType,
  findConnection,
  PersonStatus,
  RoleStates,
  State,
} from './types';

export class NightState {
  constructor(private state: WritableSignal<State>) {}

  readonly victims = computed(() => this.state().victims);
  readonly connections = computed(() => this.state().connections);
  readonly roles = computed(() => this.state().roles);

  findConnection(type: ConnectionType): Connection | undefined {
    return findConnection(this.state().connections, type);
  }

  markVictim(personId: string, byCharacterId: string) {
    this.state.update((state) => ({
      ...state,
      victims: [...withoutMarksOf(state, byCharacterId), { personId, byCharacterId }],
    }));
  }

  clearVictimsOf(characterId: string) {
    this.state.update((state) => ({ ...state, victims: withoutMarksOf(state, characterId) }));
  }

  addStatus(personId: string, status: PersonStatus) {
    this.updateStatuses(personId, (statuses) =>
      statuses.includes(status) ? statuses : [...statuses, status],
    );
  }

  removeStatus(personId: string, status: PersonStatus) {
    this.updateStatuses(personId, (statuses) => statuses.filter((entry) => entry !== status));
  }

  protect(personId: string) {
    this.clearProtection();
    this.addStatus(personId, PersonStatus.Protected);
  }

  clearProtection() {
    for (const person of this.state().people) {
      this.removeStatus(person.id, PersonStatus.Protected);
    }
  }

  enchant(personIds: readonly string[]) {
    this.clearEnchantment();
    for (const personId of personIds) {
      this.addStatus(personId, PersonStatus.Enchanted);
    }
    this.updateRoles({ enchantedTonight: [...personIds] });
  }

  clearEnchantment() {
    for (const personId of this.state().roles.enchantedTonight) {
      this.removeStatus(personId, PersonStatus.Enchanted);
    }
    this.updateRoles({ enchantedTonight: [] });
  }

  connect(type: ConnectionType, from: string, to: string) {
    this.state.update((state) => ({
      ...state,
      connections: [...withoutConnection(state, type), { type, from, to }],
    }));
  }

  disconnect(type: ConnectionType) {
    this.state.update((state) => ({ ...state, connections: withoutConnection(state, type) }));
  }

  infectWolfVictim() {
    const wolfMark = this.state().victims.find((mark) => mark.byCharacterId === WEREWOLF.id);
    if (!wolfMark) {
      return;
    }

    this.clearVictimsOf(WEREWOLF.id);
    this.addStatus(wolfMark.personId, PersonStatus.TurnedWolf);
    this.useAbility('primal_wolf_infection');
  }

  heal(personId: string) {
    this.updateRoles({ healedTonight: personId });
    this.useAbility('witch_heal');
  }

  unheal() {
    this.updateRoles({ healedTonight: undefined });
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
    if (!this.state().roles.usedAbilities.includes(ability)) {
      this.updateRoles({ usedAbilities: [...this.state().roles.usedAbilities, ability] });
    }
  }

  resetAbility(ability: Ability) {
    switch (ability) {
      case 'witch_heal':
        this.unheal();
        break;
      case 'witch_poison':
        this.unpoison(WITCH.id);
        break;
      default:
        this.restoreAbility(ability);
    }
  }

  private restoreAbility(ability: Ability) {
    this.updateRoles({
      usedAbilities: this.state().roles.usedAbilities.filter((used) => used !== ability),
    });
  }

  private updateRoles(changes: Partial<RoleStates>) {
    this.state.update((state) => ({ ...state, roles: { ...state.roles, ...changes } }));
  }

  private updateStatuses(personId: string, change: (statuses: PersonStatus[]) => PersonStatus[]) {
    this.state.update((state) => ({
      ...state,
      people: state.people.map((person) =>
        person.id === personId ? { ...person, statuses: change(person.statuses) } : person,
      ),
    }));
  }
}

function withoutMarksOf(state: State, characterId: string) {
  return state.victims.filter((mark) => mark.byCharacterId !== characterId);
}

function withoutConnection(state: State, type: ConnectionType) {
  return state.connections.filter((connection) => connection.type !== type);
}
