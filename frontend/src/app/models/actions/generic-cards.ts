import { Character } from '../character';
import { BITTER_OLD_MAN, JUGGLER, THIEF } from '../characters';
import { WerewolfCharacter } from '../werewolf-character';
import { ActionCard, filterFalsy } from './action';

export type BearSignal = 'growl' | 'silent' | 'unknown';

export function rulesCard(
  round: number,
  selected: readonly Character[],
  leftover: readonly Character[] = [],
): ActionCard {
  const wolves = selected.filter((character) => character instanceof WerewolfCharacter);
  const has = (character: Character) => selected.some((entry) => entry.id === character.id);

  return {
    key: `${round}:rules`,
    id: 'rules',
    title: $localize`:@@card.rules.title:Rules`,
    image: 'img/rules.webp',
    actions: filterFalsy([
      $localize`:@@card.rules.explain:Explain the rules`,
      wolves.length > 0 &&
      $localize`:@@card.rules.nameWolves:Name the wolves in play: ${wolves.map((wolf) => wolf.name).join(', ')}:wolves:`,
      has(BITTER_OLD_MAN) &&
      $localize`:@@card.rules.splitTheVillage:Split the village into two groups and announce them`,
      has(THIEF) &&
      $localize`:@@card.rules.thiefMiddleCards:Put the two leftover cards face down in the middle`,
      has(JUGGLER) &&
      $localize`:@@card.rules.jugglerCards:Lay out three characters with abilities face up for the Juggler, no wolves`,
      leftover.length > 0 &&
      $localize`:@@card.rules.notDealt:Not dealt: ${leftover.map((card) => card.name).join(', ')}:cards:`,
      $localize`:@@card.rules.electTheCaptain:Elect the Captain, now or later in the game`,
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

export const MIDDLE_CARD_ROLES: readonly string[] = [THIEF.id, JUGGLER.id];

export function withSendMiddleCardsButton(card: ActionCard, isSent: boolean): ActionCard {
  return {
    ...card,
    buttons: [
      ...card.buttons,
      {
        kind: 'send-middle-cards',
        label: $localize`:@@card.sendMiddleCards:Show on their phone`,
        done: isSent,
      },
    ],
  };
}

export function nightfallCard(round: number): ActionCard {
  return {
    key: `${round}:night`,
    id: 'night',
    title: $localize`:@@card.night.title:Nightfall`,
    image: 'img/night.webp',
    actions: [$localize`:@@card.night.villageSleeps:The village falls asleep`],
    buttons: [],
  };
}

export function daybreakCard(round: number, pendingChangeCount = 0, bear?: BearSignal): ActionCard {
  return {
    key: `${round}:day`,
    id: 'day',
    title: $localize`:@@card.day.title:Daybreak`,
    image: 'img/day.webp',
    actions: filterFalsy([
      $localize`:@@card.day.villageWakes:The village wakes up`,
      $localize`:@@card.day.announce:Announce what happened during the night`,
      bear === 'growl' &&
      $localize`:@@card.day.bearGrowls:Growl like a bear: a werewolf sits next to the Bear Tamer`,
      bear === 'silent' &&
      $localize`:@@card.day.bearSilent:Stay silent: no werewolf sits next to the Bear Tamer`,
      bear === 'unknown' && $localize`:@@card.day.rememberBearTamer:Remember the Bear Tamer`,
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
