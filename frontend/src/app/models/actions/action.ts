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

export function assignCard(context: NightContext, total = context.cardCount): ActionButton {
  const picks = total - context.assigned.length;

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
