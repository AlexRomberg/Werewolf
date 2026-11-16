import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Character } from '../models/character';
import { CHARACTERS_BY_ID } from '../models/characters';
import { NarratorComponent } from '../pages/narrator/narrator.component';
import { GameService } from '../services/game.service';
import { ConnectionType } from '../services/state/types';

const character = (id: string) => CHARACTERS_BY_ID.get(id) as Character;

describe('NarratorComponent, picking players on the circle', () => {
  let fixture: ComponentFixture<NarratorComponent>;
  let game: GameService;

  const page = () => fixture.nativeElement as HTMLElement;
  const notch = () => page().querySelector('[role="status"], [role="alertdialog"]');
  const seats = () => [...page().querySelectorAll<HTMLButtonElement>('button.circle')];
  const buttonNamed = (name: string) =>
    [...page().querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === name || button.ariaLabel === name,
    );
  const dialogButton = (name: string) =>
    [...page().querySelectorAll<HTMLButtonElement>('dialog button')].find(
      (button) => button.textContent?.trim() === name,
    );
  const roleOf = (seat: number) => game.people.all()[seat].character?.id;

  const click = async (element: HTMLElement | undefined) => {
    expect(element).toBeDefined();
    element?.click();
    await fixture.whenStable();
  };

  const playUntil = async (cardId: string, ...roles: string[]) => {
    game.characters.replaceSelection(roles.map((id) => [character(id), 1]));
    game.startGame();
    while (game.actions.current()?.id !== cardId) {
      game.actions.next();
    }
    await fixture.whenStable();
  };

  // jsdom has the <dialog> element but not its modal behaviour.
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(NarratorComponent);
    game = TestBed.inject(GameService);
    await fixture.whenStable();
  });

  it('should leave the circle alone while there is nothing to pick', async () => {
    await playUntil('night', 'cupid');

    expect(notch()).toBeNull();
  });

  it('should ask for the holder of the card as soon as it comes up', async () => {
    await playUntil('cupid', 'cupid');

    expect(notch()?.textContent).toContain('Select The Cupid');
    expect(notch()?.textContent).toContain('0/1');
    expect(notch()?.closest('[data-tone]')?.getAttribute('data-tone')).toBe('assign');
  });

  it('should seat the tapped player and carry on with the couple', async () => {
    await playUntil('cupid', 'cupid');
    await click(seats()[0]);

    expect(roleOf(0)).toBe('cupid');
    expect(notch()?.textContent).toContain('Assign the couple');
    expect(notch()?.closest('[data-tone]')?.getAttribute('data-tone')).toBe('bond');
  });

  it('should pair the couple only once both are picked', async () => {
    await playUntil('cupid', 'cupid');
    await click(seats()[0]);
    await click(seats()[1]);

    expect(notch()?.textContent).toContain('1/2');
    expect(seats()[1].getAttribute('data-pick')).toBe('picked');
    expect(game.night.findConnection(ConnectionType.Love)).toBeUndefined();

    await click(seats()[2]);

    const [, second, third] = game.people.all();
    expect(game.night.findConnection(ConnectionType.Love)).toMatchObject({
      from: second.id,
      to: third.id,
    });
    expect(notch()).toBeNull();
  });

  it('should take a pick back when the seat is tapped again', async () => {
    await playUntil('cupid', 'cupid');
    await click(seats()[0]);
    await click(seats()[1]);
    await click(seats()[1]);

    expect(notch()?.textContent).toContain('0/2');
  });

  it('should stop picking on this card when the notch is closed', async () => {
    await playUntil('cupid', 'cupid');
    await click(buttonNamed('Stop selecting'));

    expect(notch()).toBeNull();

    await click(seats()[0]);
    expect(roleOf(0)).toBeUndefined();
  });

  it('should pick again when the button on the card is pressed', async () => {
    await playUntil('cupid', 'cupid');
    await click(buttonNamed('Stop selecting'));
    await click(buttonNamed('Assign the couple'));

    expect(notch()?.textContent).toContain('Assign the couple');
  });

  it('should drop a half-made pick when the narrator moves on', async () => {
    await playUntil('cupid', 'cupid', 'seer');
    await click(seats()[0]);
    await click(seats()[1]);
    await click(buttonNamed('Next'));
    await click(buttonNamed('Back'));

    expect(notch()?.textContent).toContain('0/2');
  });

  it('should ask before taking a card away from a player', async () => {
    await playUntil('seer', 'cupid', 'seer');
    game.people.assign([game.people.all()[0].id], character('cupid'));
    await fixture.whenStable();

    expect(seats()[0].getAttribute('data-pick')).toBe('cautioned');

    await click(seats()[0]);

    expect(notch()?.getAttribute('role')).toBe('alertdialog');
    expect(notch()?.textContent).toContain('The Cupid');
    expect(roleOf(0)).toBe('cupid');
  });

  it('should leave things as they were when the question is cancelled', async () => {
    await playUntil('seer', 'cupid', 'seer');
    game.people.assign([game.people.all()[0].id], character('cupid'));
    await fixture.whenStable();
    await click(seats()[0]);
    await click(buttonNamed('Cancel'));

    expect(roleOf(0)).toBe('cupid');
    expect(notch()?.textContent).toContain('Select The Seer');
  });

  it('should reassign the card when the question is confirmed', async () => {
    await playUntil('seer', 'cupid', 'seer');
    game.people.assign([game.people.all()[0].id], character('cupid'));
    await fixture.whenStable();
    await click(seats()[0]);
    await click(buttonNamed('Continue'));

    expect(roleOf(0)).toBe('seer');
  });

  it('should wait for a potion to be pressed before the Witch picks', async () => {
    await playUntil('witch', 'witch');
    await click(seats()[0]);

    expect(roleOf(0)).toBe('witch');
    expect(notch()).toBeNull();

    await click(buttonNamed('Poison someone'));
    expect(notch()?.closest('[data-tone]')?.getAttribute('data-tone')).toBe('kill');

    await click(seats()[1]);
    expect(game.night.victims()).toEqual([
      { personId: game.people.all()[1].id, byCharacterId: 'witch' },
    ]);
    expect(notch()).toBeNull();
  });

  it('should let the Hoodrat stay at home by picking themself', async () => {
    await playUntil('hoodrat', 'hoodrat');
    await click(seats()[0]);

    expect(notch()?.textContent).toContain('Assign a host');

    await click(seats()[0]);

    expect(game.night.findConnection(ConnectionType.Sleepover)).toBeUndefined();
    expect(notch()).toBeNull();
  });

  it('should list the characters in play for looking them up', async () => {
    await playUntil('night', 'cupid', 'seer');
    await click(page().querySelector<HTMLButtonElement>('button[aria-expanded]') ?? undefined);

    const tiles = [...page().querySelectorAll('button.card-tile')].map((tile) =>
      tile.textContent?.trim(),
    );
    expect(tiles).toEqual(expect.arrayContaining(['The Cupid', 'The Seer']));
  });

  it('should draw a line between two linked players, clear of their seats', async () => {
    await playUntil('cupid', 'cupid');
    expect(page().querySelector('.connection')).toBeNull();

    await click(seats()[0]);
    await click(seats()[1]);
    await click(seats()[2]);

    const line = page().querySelector<HTMLElement>('.connection');
    expect(line?.getAttribute('data-connection')).toBe('love');
    // Seats two and three of five sit 66 degrees apart on a circle of radius 40.
    expect(Number(line?.style.getPropertyValue('--length'))).toBeCloseTo(43.57, 1);
    expect(page().textContent).toContain('In love');
  });

  it('should keep the rearrange button with the legend, in the corner of the circle', async () => {
    await playUntil('cupid', 'cupid');

    expect(buttonNamed('Rearrange')?.closest('app-circle')).not.toBeNull();
    expect(buttonNamed('End game')?.closest('app-circle')).toBeNull();
  });

  it('should let the narrator rearrange the table mid-game, with picking on hold', async () => {
    await playUntil('cupid', 'cupid');
    expect(buttonNamed('Rearrange')?.getAttribute('aria-pressed')).toBe('false');

    await click(buttonNamed('Rearrange'));

    expect(notch()).toBeNull();
    expect(seats().length).toBe(game.people.all().length + 1);

    await click(buttonNamed('Done'));

    expect(notch()?.textContent).toContain('Select The Cupid');
    expect(seats().length).toBe(game.people.all().length);
  });

  it('should ask before ending the game, and carry on if the narrator declines', async () => {
    await playUntil('cupid', 'cupid');
    await click(buttonNamed('End game'));
    expect(page().querySelector('dialog')?.textContent).toContain('End this game?');

    await click(dialogButton('Keep playing'));

    expect(page().querySelector('dialog')).toBeNull();

    expect(game.phase()).toBe('playing');
    expect(buttonNamed('Rearrange')).toBeDefined();
  });

  it('should go back to setup with a clean table when the game is ended', async () => {
    await playUntil('cupid', 'cupid');
    await click(seats()[0]);
    await click(buttonNamed('End game'));
    await click(dialogButton('End game'));

    expect(game.phase()).toBe('setup');
    expect(roleOf(0)).toBeUndefined();
    expect(notch()).toBeNull();
    expect(buttonNamed('Rearrange')).toBeUndefined();
    expect(page().querySelector('dialog')).toBeNull();
    expect(game.characters.inPlay().map((c) => c.id)).toContain('cupid');
  });

  describe('changing and undoing a pick', () => {
    const victims = () => game.night.victims().map((mark) => mark.personId);
    const buttonStarting = (name: string) =>
      [...page().querySelectorAll('button')].find((button) =>
        button.textContent?.trim().startsWith(name),
      );

    beforeEach(async () => {
      await playUntil('werewolf', 'werewolf');
      await click(seats()[0]);
      await click(seats()[1]);
    });

    it('should show on the seat who was marked', () => {
      expect(victims()).toEqual([game.people.all()[1].id]);
      expect(seats()[1].parentElement?.querySelector('[data-badge="victim"]')).not.toBeNull();
      expect(seats()[1].getAttribute('aria-label')).toBe('Seat 2, Marked as a victim');
    });

    it('should keep the button on the card once the pick is made, without asking again', () => {
      expect(notch()).toBeNull();
      expect(buttonStarting('Mark victim')?.textContent).toContain('Change');
    });

    it('should replace the pick when the button is pressed again', async () => {
      await click(buttonStarting('Mark victim'));
      expect(notch()?.textContent).toContain('Mark victim');

      await click(seats()[2]);

      expect(victims()).toEqual([game.people.all()[2].id]);
      expect(notch()).toBeNull();
    });

    it('should take the pick back altogether, and leave it at that', async () => {
      await click(buttonNamed('Undo: Mark victim'));

      expect(victims()).toEqual([]);
      expect(notch()).toBeNull();
      expect(buttonNamed('Undo: Mark victim')).toBeUndefined();
    });
  });

  describe('the morning', () => {
    const dialog = () => page().querySelector('dialog');
    const isDead = (seat: number) => game.people.views()[seat].isDead;
    const headlines = () =>
      [...page().querySelectorAll('dialog [data-headline]')].map((line) =>
        line.textContent?.trim(),
      );
    const notes = () =>
      [...page().querySelectorAll('dialog [data-note]')].map((line) => line.textContent?.trim());

    const nightWithAVictim = async () => {
      await playUntil('werewolf', 'werewolf');
      await click(seats()[0]);
      await click(seats()[1]);
      game.night.connect(ConnectionType.Love, game.people.all()[1].id, game.people.all()[2].id);
      await click(buttonNamed('Next'));
    };
    const openChanges = () => click(buttonNamed('Show changes (2 open)'));

    it('should wait to be asked for the news when day breaks', async () => {
      await nightWithAVictim();

      expect(game.actions.current()?.id).toBe('day');
      expect(dialog()).toBeNull();
      expect(buttonNamed('Show changes (2 open)')).toBeDefined();
    });

    it('should keep what happened apart from the background for the narrator', async () => {
      await nightWithAVictim();
      await openChanges();

      expect(headlines()).toEqual(['Seat 2 got killed', 'Seat 3 died of a broken heart']);
      expect(notes()).toEqual(['By the Simple Werewolf', 'In love with Seat 2']);
    });

    it('should call a player by name, then by role, then by seat', async () => {
      await playUntil('werewolf', 'werewolf', 'cupid');
      const [wolf, named, cupid, nobody] = game.people.all();
      game.people.update(named.id, { ...named, name: 'Anna', character: character('seer') });
      game.people.assign([wolf.id], character('werewolf'));
      game.people.assign([cupid.id], character('cupid'));
      game.night.markVictim(named.id, 'werewolf');
      game.night.poison(cupid.id, 'witch');
      game.night.markVictim(nobody.id, 'big_wolf');
      await click(buttonNamed('Next'));
      await click(buttonNamed('Show changes (3 open)'));

      expect(headlines()).toEqual(['Anna got killed', 'The Cupid got killed', 'Seat 4 got killed']);
    });

    it('should make clear that only one holder of a shared card is meant', async () => {
      await playUntil('werewolf', 'werewolf', 'sisters');
      const [sister] = game.people.all();
      game.people.assign([sister.id], character('sisters'));
      game.night.markVictim(sister.id, 'werewolf');
      await click(buttonNamed('Next'));
      await click(buttonNamed('Show changes (1 open)'));

      expect(headlines()).toEqual(['One of the Two Sisters got killed']);
    });

    it('should show who caused a change, half hidden behind the player', async () => {
      await nightWithAVictim();
      await openChanges();

      const causes = [...page().querySelectorAll('dialog [data-cause]')];
      expect(causes.map((cause) => cause.getAttribute('title'))).toEqual([
        'The Simple Werewolf',
        'Seat 2',
      ]);
      expect(causes[0].querySelector('img')?.getAttribute('src')).toContain('werewolf.png');
    });

    it('should apply the changes one by one', async () => {
      await nightWithAVictim();
      await openChanges();
      await click(dialogButton('Apply'));

      expect(isDead(1)).toBe(true);
      expect(isDead(2)).toBe(false);
      expect(dialog()?.textContent).toContain('Applied');
      expect(headlines().length).toBe(2);
      expect(seats()[1].classList).toContain('dead');

      await click(dialogButton('Apply'));

      expect(isDead(2)).toBe(true);
      expect(dialogButton('Apply')).toBeUndefined();
      expect(dialogButton('Apply all')).toBeUndefined();
    });

    it('should list what needs no applying below, without a button', async () => {
      await playUntil('werewolf', 'werewolf');
      const [victim, child] = game.people.all();
      game.night.protect(victim.id);
      game.night.markVictim(victim.id, 'werewolf');
      game.night.connect(ConnectionType.Trust, child.id, victim.id);
      await click(buttonNamed('Next'));
      await click(buttonNamed('Show changes'));

      const informational = page().querySelector('dialog [data-informational]');
      expect(informational?.textContent).toContain('Seat 1 survived the attack');
      expect(dialogButton('Apply')).toBeUndefined();
      expect(dialogButton('Apply all')).toBeUndefined();
    });

    it('should let the Wild Child be turned from the informational list', async () => {
      await playUntil('werewolf', 'werewolf');
      const [victim, child] = game.people.all();
      game.night.markVictim(victim.id, 'werewolf');
      game.night.connect(ConnectionType.Trust, child.id, victim.id);
      await click(buttonNamed('Next'));
      await click(buttonNamed('Show changes (2 open)'));

      const informational = page().querySelector('dialog [data-informational]');
      expect(informational?.textContent).toContain('Seat 2 turned into a wolf');
      expect(informational?.querySelector('button')?.textContent?.trim()).toBe('Apply');
    });

    it('should apply everything at once on request', async () => {
      await nightWithAVictim();
      await openChanges();
      await click(dialogButton('Apply all'));

      expect(isDead(1)).toBe(true);
      expect(isDead(2)).toBe(true);
      expect(buttonNamed('Show changes')).toBeDefined();
    });

    it('should ask before a night is left with changes still open', async () => {
      await nightWithAVictim();
      await click(buttonNamed('Next night'));

      expect(game.actions.round()).toBe(0);

      await click(dialogButton('Apply all and go on'));

      expect(game.actions.round()).toBe(1);
      expect(isDead(1)).toBe(true);
      expect(isDead(2)).toBe(true);
      expect(dialog()).toBeNull();
    });

    it('should let the narrator overrule the app and skip what is left', async () => {
      await nightWithAVictim();
      await click(buttonNamed('Next night'));
      await click(dialogButton('Apply'));
      await click(dialogButton('Skip the rest'));

      expect(game.actions.round()).toBe(1);
      expect(isDead(1)).toBe(true);
      expect(isDead(2)).toBe(false);
    });

    it('should move on without a word after a quiet night', async () => {
      await playUntil('day', 'werewolf');
      await click(buttonNamed('Next night'));

      expect(dialog()).toBeNull();
      expect(game.actions.round()).toBe(1);
    });

    it('should say so after a quiet night', async () => {
      await playUntil('day', 'werewolf');
      await click(buttonNamed('Show changes'));

      expect(headlines()).toEqual(['Nobody died']);
    });
  });

  describe('abilities that are used up', () => {
    const card = () => page().textContent ?? '';

    it('should show that the fox has missed, and take it back on request', async () => {
      await playUntil('fox', 'fox');
      await click(buttonNamed('Has missed'));

      expect(card()).toContain('Has missed and will not wake up again');
      expect(game.night.roles().usedAbilities).toEqual(['fox_request']);

      await click(buttonNamed('Undo: Has missed'));

      expect(game.night.roles().usedAbilities).toEqual([]);
    });

    it('should give a spent ability back after asking', async () => {
      await playUntil('night', 'fox', 'witch');
      game.night.useAbility('fox_request');
      game.night.useAbility('witch_heal');
      game.night.useAbility('witch_poison');
      game.actions.next();
      while (game.actions.current()?.id !== 'night') {
        game.actions.next();
      }
      await fixture.whenStable();
      const cardIds = () => game.actions.queue().map((queued) => queued.id);
      expect(cardIds()).toEqual(['night', 'day']);

      await click(buttonNamed('Give back: Fox: has missed'));
      await click(dialogButton('Give back'));

      expect(game.night.roles().usedAbilities).toEqual(['witch_heal', 'witch_poison']);
      expect(cardIds()).toEqual(['night', 'fox', 'day']);
      expect(game.actions.current()?.id).toBe('night');
    });

    it('should stay on the current card when an earlier role wakes up again', async () => {
      await playUntil('day', 'fox', 'witch');
      game.night.useAbility('fox_request');
      game.actions.next();
      while (game.actions.current()?.id !== 'witch') {
        game.actions.next();
      }
      await fixture.whenStable();

      await click(buttonNamed('Give back: Fox: has missed'));
      await click(dialogButton('Give back'));

      expect(game.actions.current()?.id).toBe('witch');
    });
  });

  describe("a player's status", () => {
    it('should be set by hand from the panel of the player', async () => {
      await playUntil('night', 'werewolf');
      await click(seats()[2]);
      await click(buttonNamed('Dead'));

      expect(game.people.views()[2].isDead).toBe(true);
      expect(buttonNamed('Dead')?.getAttribute('aria-pressed')).toBe('true');

      await click(buttonNamed('Dead'));

      expect(game.people.views()[2].isDead).toBe(false);
    });
  });
});
