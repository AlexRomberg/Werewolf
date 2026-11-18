import {
  ConnectionType,
  findConnection,
  hasStatus,
  isAlive,
  Person,
  PersonStatus,
} from '../../services/state/types';
import { WHITE_WOLF } from '../characters';
import { isWerewolf } from '../werewolf-character';
import { ActionButton, ActionButtonKind, ActionCard } from './action';
import { NightContext } from './context';

export interface SelectionChoice {
  readonly cardKey: string;
  readonly kind: ActionButtonKind | null;
}

export function activeButton(
  card: ActionCard | undefined,
  choice: SelectionChoice | null,
): ActionButton | undefined {
  if (!card) {
    return undefined;
  }

  const ownChoice = choice?.cardKey === card.key ? choice : null;
  if (ownChoice?.kind === null) {
    return undefined;
  }

  const picking = card.buttons.filter((button) => button.picks !== undefined);
  return (
    picking.find((button) => button.kind === ownChoice?.kind) ??
    picking.find((button) => button.auto)
  );
}

export function isStayingHome(button: ActionButton, person: Person, context: NightContext) {
  return button.kind === 'sleepover' && holdsCard(person, context);
}

export function pickWarning(
  button: ActionButton,
  cardId: string,
  person: Person,
  context: NightContext,
): string | undefined {
  if (!isAlive(person)) {
    return $localize`:@@pick.dead:This player is dead.`;
  }

  switch (button.kind) {
    case 'assign-card':
      return assignWarning(cardId, person);
    case 'mark-victim':
      return markWarning(cardId, person);
    case 'protect':
      return person.id === context.roles.healerLastProtected
        ? $localize`:@@pick.protectedLastNight:This player was already protected last night.`
        : undefined;
    case 'sleepover':
      return person.id === context.roles.hoodratLastHost
        ? $localize`:@@pick.hoodratStayedLastNight:The Hoodrat already stayed here last night.`
        : undefined;
    case 'set-role-model':
      return holdsCard(person, context)
        ? $localize`:@@pick.ownRoleModel:The Wild Child cannot be their own role model.`
        : undefined;
    case 'enchant':
      return enchantWarning(person, context);
    case 'heal':
      return isWolfVictim(cardId, person, context)
        ? undefined
        : $localize`:@@pick.notAWolfVictim:The wolves did not come for this player.`;
    default:
      return undefined;
  }
}

function assignWarning(cardId: string, person: Person) {
  if (!person.character) {
    return undefined;
  }

  return person.character.id === cardId
    ? $localize`:@@pick.holdsThisCard:This player already holds this card.`
    : $localize`:@@pick.holdsOtherCard:This player is already ${person.character.name}:character: and would be reassigned.`;
}

function markWarning(cardId: string, person: Person) {
  if (cardId === WHITE_WOLF.id) {
    return isWerewolf(person)
      ? undefined
      : $localize`:@@pick.notAWerewolf:This player is not a werewolf.`;
  }

  return isWerewolf(person) ? $localize`:@@pick.isAWerewolf:This player is a werewolf.` : undefined;
}

function enchantWarning(person: Person, context: NightContext) {
  if (holdsCard(person, context)) {
    return $localize`:@@pick.enchantSelf:The Piper cannot enchant themself.`;
  }

  return hasStatus(person, PersonStatus.Enchanted)
    ? $localize`:@@pick.alreadyEnchanted:This player is already enchanted.`
    : undefined;
}

function holdsCard(person: Person, context: NightContext) {
  return context.assigned.some((holder) => holder.id === person.id);
}

function isWolfVictim(witchId: string, person: Person, context: NightContext) {
  const sleepover = findConnection(context.connections, ConnectionType.Sleepover);
  const host = sleepover?.from === person.id ? sleepover.to : undefined;
  return context.victims.some(
    (mark) =>
      mark.byCharacterId !== witchId && (mark.personId === person.id || mark.personId === host),
  );
}
