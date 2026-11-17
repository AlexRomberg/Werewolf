import { Character } from '../character';
import { BEAR_TAMER } from '../characters';
import { WerewolfCharacter } from '../werewolf-character';
import { ActionCard, filterFalsy } from './action';

export function rulesCard(round: number, selected: readonly Character[]): ActionCard {
  const wolves = selected.filter((character) => character instanceof WerewolfCharacter);

  return {
    key: `${round}:rules`,
    id: 'rules',
    title: $localize`:@@card.rules.title:Rules`,
    image: 'img/rules.png',
    actions: filterFalsy([
      $localize`:@@card.rules.explain:Explain the rules`,
      wolves.length > 0 &&
        $localize`:@@card.rules.nameWolves:Name the wolves in play: ${wolves.map((wolf) => wolf.name).join(', ')}:wolves:`,
      $localize`:@@card.rules.openingStory:Tell the opening story`,
    ]),
    buttons: [],
  };
}

export function withDealShuffledButton(card: ActionCard, hasDealt: boolean): ActionCard {
  return {
    ...card,
    buttons: [
      ...card.buttons,
      {
        kind: 'deal-shuffled',
        label: hasDealt
          ? $localize`:@@card.rules.dealAgain:Assign cards again`
          : $localize`:@@card.rules.deal:Assign cards`,
      },
    ],
  };
}

export function nightfallCard(round: number): ActionCard {
  return {
    key: `${round}:night`,
    id: 'night',
    title: $localize`:@@card.night.title:Nightfall`,
    image: 'img/night.png',
    actions: [$localize`:@@card.night.villageSleeps:The village falls asleep`],
    buttons: [],
  };
}

export function daybreakCard(
  round: number,
  selected: readonly Character[],
  pendingChangeCount = 0,
): ActionCard {
  const hasBearTamer = selected.some((character) => character.id === BEAR_TAMER.id);

  return {
    key: `${round}:day`,
    id: 'day',
    title: $localize`:@@card.day.title:Daybreak`,
    image: 'img/day.png',
    actions: filterFalsy([
      $localize`:@@card.day.villageWakes:The village wakes up`,
      $localize`:@@card.day.announce:Announce what happened during the night`,
      hasBearTamer && $localize`:@@card.day.rememberBearTamer:Remember the Bear Tamer`,
      $localize`:@@card.day.openDiscussion:Open the discussion`,
    ]),
    buttons: [
      {
        kind: 'show-daybreak-changes',
        label:
          pendingChangeCount > 0
            ? $localize`:@@card.day.showOpenChanges:Show changes (${pendingChangeCount}:count: open)`
            : $localize`:@@card.day.showChanges:Show changes`,
      },
    ],
  };
}
