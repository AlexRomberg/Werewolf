import { NightContext } from './context';

export type ActionButtonKind =
  | 'assign-card'
  | 'mark-victim'
  | 'infect'
  | 'protect'
  | 'heal'
  | 'poison'
  | 'pair-lovers'
  | 'set-role-model'
  | 'sleepover'
  | 'enchant'
  | 'lose-fox-request'
  | 'show-daybreak-changes'
  | 'deal-shuffled'
  | 'show-middle-cards'
  | 'send-middle-cards';

export type ActionTone = 'assign' | 'kill' | 'protect' | 'bond' | 'enchant' | 'neutral';

export const TONE_BY_KIND: Record<ActionButtonKind, ActionTone> = {
  'assign-card': 'assign',
  'mark-victim': 'kill',
  poison: 'kill',
  protect: 'protect',
  heal: 'protect',
  'pair-lovers': 'bond',
  'set-role-model': 'bond',
  sleepover: 'bond',
  enchant: 'enchant',
  infect: 'neutral',
  'lose-fox-request': 'neutral',
  'show-daybreak-changes': 'neutral',
  'deal-shuffled': 'assign',
  'show-middle-cards': 'neutral',
  'send-middle-cards': 'neutral',
};

/** Checklist lines and labels several roles share, translated once. */
export const COMMON_LINES = {
  assignPerson: $localize`:@@common.assignPerson:Assign person`,
  assignPeople: $localize`:@@common.assignPeople:Assign people`,
  backToSleep: $localize`:@@common.backToSleep:Can go back to sleep right away`,
  finishedForTheNight: $localize`:@@common.finishedForTheNight:Is finished for this night`,
  mayExchange: $localize`:@@common.mayExchange:They may exchange with each other`,
};

export interface ActionButton {
  readonly kind: ActionButtonKind;
  readonly label: string;
  readonly picks?: number;
  readonly auto?: boolean;
  readonly done?: boolean;
}

export interface ActionCard {
  readonly key: string;
  readonly id: string;
  readonly title: string;
  readonly image: string;
  readonly actions: readonly string[];
  readonly buttons: readonly ActionButton[];
}

export function assignButton(
  context: NightContext,
  total = context.cardCount,
): ActionButton | false {
  const picks = total - context.assigned.length;
  if (picks <= 0) {
    return false;
  }

  return {
    kind: 'assign-card',
    label: picks === 1 ? COMMON_LINES.assignPerson : COMMON_LINES.assignPeople,
    picks,
    auto: true,
  };
}

export function showMiddleCardsButton(context: NightContext): ActionButton | false {
  return (
    context.leftover.length > 0 && {
      kind: 'show-middle-cards',
      label: $localize`:@@common.showMiddleCards:Show the middle cards`,
    }
  );
}

export function pickButton(
  kind: ActionButtonKind,
  label: string,
  picks: number,
  done: boolean,
  auto = !done,
): ActionButton {
  return { kind, label, picks, done, auto };
}

export function filterFalsy<T>(entries: readonly (T | false)[]): T[] {
  return entries.filter((entry): entry is T => entry !== false);
}
