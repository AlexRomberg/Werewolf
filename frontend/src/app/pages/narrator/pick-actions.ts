import { ActionButton, ActionCard } from '../../models/actions/action';
import { CHARACTERS_BY_ID } from '../../models/characters';
import { GameService } from '../../services/game.service';
import { ConnectionType } from '../../services/state/types';

export function applyPick(
  game: GameService,
  card: ActionCard,
  button: ActionButton,
  ids: readonly string[],
) {
  const { night, people } = game;
  const [first, second] = ids;
  const holder = game.actions.currentContext()?.assigned[0]?.id;

  switch (button.kind) {
    case 'assign-card': {
      const character = CHARACTERS_BY_ID.get(card.id);
      if (character) {
        people.assign(ids, character);
      }
      break;
    }
    case 'mark-victim':
      night.markVictim(first, card.id);
      break;
    case 'protect':
      night.protect(first);
      break;
    case 'heal':
      night.heal(first);
      break;
    case 'poison':
      night.poison(first, card.id);
      break;
    case 'pair-lovers':
      night.connect(ConnectionType.Love, first, second);
      break;
    case 'set-role-model':
      if (holder) {
        night.connect(ConnectionType.Trust, holder, first);
      }
      break;
    case 'sleepover':
      if (holder) {
        night.connect(ConnectionType.Sleepover, holder, first);
      }
      break;
    case 'enchant':
      night.enchant(ids);
      break;
  }
}

export function clearPick(game: GameService, card: ActionCard, button: ActionButton) {
  const { night } = game;

  switch (button.kind) {
    case 'mark-victim':
      night.clearVictimsOf(card.id);
      break;
    case 'protect':
      night.clearProtection();
      break;
    case 'heal':
      night.unheal();
      break;
    case 'poison':
      night.unpoison(card.id);
      break;
    case 'pair-lovers':
      night.disconnect(ConnectionType.Love);
      break;
    case 'set-role-model':
      night.disconnect(ConnectionType.Trust);
      break;
    case 'sleepover':
      night.disconnect(ConnectionType.Sleepover);
      break;
    case 'enchant':
      night.clearEnchantment();
      break;
    case 'lose-fox-request':
      night.resetAbility('fox_request');
      break;
  }
}
