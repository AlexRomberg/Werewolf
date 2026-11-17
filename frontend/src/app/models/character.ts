import { ActionButton } from './actions/action';
import { NightContext } from './actions/context';

export enum GroupType {
  Wolves = 'wolves',
  Active = 'active',
  Passive = 'passive',
  Loners = 'loners',
}

export enum GameSet {
  BaseGame = 'base-game',
  NewMoon = 'new-moon',
  Characters = 'characters',
  Special = 'special',
}

export const GROUP_LABELS: ReadonlyMap<GroupType, string> = new Map([
  [GroupType.Wolves, 'Wolves'],
  [GroupType.Active, 'Active'],
  [GroupType.Passive, 'Passive'],
  [GroupType.Loners, 'Loners'],
]);

export const GAME_SET_LABELS: ReadonlyMap<GameSet, string> = new Map([
  [GameSet.BaseGame, 'Base Game'],
  [GameSet.Characters, 'Characters'],
  [GameSet.NewMoon, 'New Moon'],
  [GameSet.Special, 'Special'],
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
  abstract readonly group: GroupType;
  abstract readonly game: GameSet;
  abstract readonly description: readonly DescriptionSection[];

  readonly hasMultiple: boolean = false;
  readonly memberName?: string;
  readonly priority: number = -1;

  get image() {
    return `img/${this.id}.png`;
  }

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

export function copiesOf(character: Character, amount: number): Character[] {
  return new Array<Character>(amount).fill(character);
}
