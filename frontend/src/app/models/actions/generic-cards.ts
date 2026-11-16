import { Character } from '../character';
import { BEAR_TAMER } from '../characters';
import { WerewolfCharacter } from '../werewolf-character';
import { ActionCard, filterFalsy } from './action';

export function rulesCard(round: number, selected: readonly Character[]): ActionCard {
  const wolves = selected.filter((character) => character instanceof WerewolfCharacter);

  return {
    key: `${round}:rules`,
    id: 'rules',
    title: 'Rules',
    image: 'img/rules.png',
    actions: filterFalsy([
      'Explain the rules',
      wolves.length > 0 && `Name the wolves in play: ${wolves.map((wolf) => wolf.name).join(', ')}`,
      'Tell the opening story',
    ]),
    buttons: [],
  };
}

export function nightfallCard(round: number): ActionCard {
  return {
    key: `${round}:night`,
    id: 'night',
    title: 'Nightfall',
    image: 'img/night.png',
    actions: ['The village falls asleep'],
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
    title: 'Daybreak',
    image: 'img/day.png',
    actions: filterFalsy([
      'The village wakes up',
      'Announce what happened during the night',
      hasBearTamer && 'Remember the Bear Tamer',
      'Open the discussion',
    ]),
    buttons: [
      {
        kind: 'show-daybreak-changes',
        label:
          pendingChangeCount > 0 ? `Show changes (${pendingChangeCount} open)` : 'Show changes',
      },
    ],
  };
}
