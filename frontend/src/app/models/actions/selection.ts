import { isAlive, Person, PlayerStatus } from '../../services/state/types';
import { ActionButton, ActionButtonKind, ActionCard } from './action';
import { NightContext } from './context';
import { WerewolfCharacter } from '../werewolf-character';

const WHITE_WOLF_ID = 'white_wolf';

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
    return 'This player is dead.';
  }

  switch (button.kind) {
    case 'assign-card':
      return assignWarning(cardId, person);
    case 'mark-victim':
      return cardId === WHITE_WOLF_ID && !isWerewolf(person)
        ? 'This player is not a werewolf.'
        : undefined;
    case 'protect':
      return person.id === context.roles.healerLastProtected
        ? 'This player was already protected last night.'
        : undefined;
    case 'sleepover':
      return person.id === context.roles.hoodratLastHost
        ? 'The Hoodrat already stayed here last night.'
        : undefined;
    case 'set-role-model':
      return holdsCard(person, context)
        ? 'The Wild Child cannot be their own role model.'
        : undefined;
    case 'enchant':
      return enchantWarning(person, context);
    case 'heal':
      return isWolfVictim(cardId, person, context)
        ? undefined
        : 'The wolves did not come for this player.';
    default:
      return undefined;
  }
}

function assignWarning(cardId: string, person: Person) {
  if (!person.character) {
    return undefined;
  }

  return person.character.id === cardId
    ? 'This player already holds this card.'
    : `This player is already ${person.character.name} and would be reassigned.`;
}

function enchantWarning(person: Person, context: NightContext) {
  if (holdsCard(person, context)) {
    return 'The Piper cannot enchant themself.';
  }

  return person.statuses.includes(PlayerStatus.Enchanted)
    ? 'This player is already enchanted.'
    : undefined;
}

function isWerewolf(person: Person) {
  return (
    person.character instanceof WerewolfCharacter ||
    person.statuses.includes(PlayerStatus.TurnedWolf)
  );
}

function holdsCard(person: Person, context: NightContext) {
  return context.assigned.some((holder) => holder.id === person.id);
}

function isWolfVictim(witchId: string, person: Person, context: NightContext) {
  return context.victims.some(
    (victim) => victim.personId === person.id && victim.byCharacterId !== witchId,
  );
}
