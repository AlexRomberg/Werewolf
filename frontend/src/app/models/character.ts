import { ActionButton } from './actions/action';
import { NightContext } from './actions/context';

export enum GroupTypes {
  Wolves = 'wolves',
  Active = 'active',
  Passive = 'passive',
  Loners = 'loners',
}

export enum GameSets {
  BaseGame = 'base-game',
  NewMoon = 'new-moon',
  Characters = 'characters',
  Special = 'special',
}

export const GROUP_LABELS: ReadonlyMap<GroupTypes, string> = new Map([
  [GroupTypes.Wolves, 'Wolves'],
  [GroupTypes.Active, 'Active'],
  [GroupTypes.Passive, 'Passive'],
  [GroupTypes.Loners, 'Loners'],
]);

export const GAME_SET_LABELS: ReadonlyMap<GameSets, string> = new Map([
  [GameSets.BaseGame, 'Base Game'],
  [GameSets.Characters, 'Characters'],
  [GameSets.NewMoon, 'New Moon'],
  [GameSets.Special, 'Special'],
]);

export enum BasePriority {
  Initial = 0,
  Wolf = 50,
  PostWolf = 100,
}

export interface DescriptionSection {
  title: string;
  description: string;
}

export const SectionTitles = {
  general: 'General',
  hintForTheNarrator: 'Hint for the narrator',
  attention: 'Attention',
  variantForTheBrave: 'Variant for the brave',
  hint: 'Hint',
  specialCase: 'Special case',
  explanations: 'Explanations',
};

export abstract class Character {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly group: GroupTypes;
  abstract readonly game: GameSets;
  abstract readonly description: readonly DescriptionSection[];

  readonly hasMultiple: boolean = false;
  readonly memberName?: string;
  readonly priority: number = -1;

  isAwakeThisNight(_context: NightContext): boolean {
    return false;
  }

  getActions(_context: NightContext): (string | false)[] {
    return [];
  }

  getButtons(_context: NightContext): ActionButton[] {
    return [];
  }
}
