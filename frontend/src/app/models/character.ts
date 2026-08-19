export enum GroupTypes {
  Wolves,
  Active,
  Passive,
  Loners,
}

export enum GameSets {
  BaseGame,
  NewMoon,
  Characters,
  Special,
}

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
  general: "General",
  hintForTheNarrator: "Hint for the narrator",
  attention: "Attention",
  variantForTheBrave: "Variant for the brave",
  hint: "Hint",
  specialCase: "Special case",
  explanations: "Explanations",
}

export abstract class Character {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly group: GroupTypes;
  abstract readonly game: GameSets;
  abstract readonly description: readonly DescriptionSection[];

  readonly hasMultiple: boolean = false;
  readonly priority: number = -1;

  isAwakeThisNight(_round: number): boolean {
    return false;
  }
}
