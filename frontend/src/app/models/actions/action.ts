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
  | 'show-daybreak-changes';

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
};

export interface ActionButton {
  readonly kind: ActionButtonKind;
  readonly label: string;
  /** How many people the narrator picks on the circle; absent for a button that acts at once. */
  readonly picks?: number;
  /** Whether the picking starts by itself when the card comes up, without a press. */
  readonly auto?: boolean;
  /** Whether the ability was already used tonight, so it can be changed or undone. */
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

/** The button that seats the card's holders, or `false` once nobody is missing. */
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
    label: picks === 1 ? 'Assign person' : 'Assign people',
    picks,
    auto: true,
  };
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
