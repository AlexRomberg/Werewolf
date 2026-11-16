import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { PlayerCard } from '@protocol';
import { SectionTitles } from '../models/character';
import { WEREWOLF } from '../models/characters';
import { RoomComponent } from '../pages/room/room.component';
import { RoomPlayerService, RoomStatus } from '../services/room-player.service';

const WEREWOLF_CARD: PlayerCard = {
  characterId: WEREWOLF.id,
  isDead: false,
  isWerewolf: true,
  isEnchanted: false,
  links: [],
};

describe('RoomComponent, a joined player', () => {
  let fixture: ComponentFixture<RoomComponent>;
  const status = signal<RoomStatus>('joined');
  const card = signal<PlayerCard | null>(null);

  const element = () => fixture.nativeElement as HTMLElement;
  const cardButton = () => element().querySelector<HTMLButtonElement>('app-player-card button')!;
  const hint = () => element().querySelector('[aria-live] + div + p')?.textContent?.trim() ?? '';
  const title = () => element().querySelector('h1')?.textContent?.trim();

  beforeEach(async () => {
    status.set('joined');
    card.set(null);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: RoomPlayerService,
          useValue: { status, card, join: () => undefined, leave: () => undefined },
        },
      ],
    });
    fixture = TestBed.createComponent(RoomComponent);
    fixture.componentRef.setInput('code', '42');
    await fixture.whenStable();
  });

  it('should wait face down until a card is dealt', () => {
    expect(cardButton().disabled).toBe(true);
    expect(hint()).toContain('Waiting for the narrator');
  });

  it('should ask the player to turn a dealt card around', async () => {
    card.set(WEREWOLF_CARD);
    await fixture.whenStable();

    expect(cardButton().disabled).toBe(false);
    expect(hint()).toContain('Tap your card');
    expect(title()).toBe('Face down');
  });

  it('should show the role above the card once it is turned', async () => {
    card.set(WEREWOLF_CARD);
    await fixture.whenStable();
    cardButton().click();
    await fixture.whenStable();

    expect(title()).toBe(WEREWOLF.name);
  });

  it('should only ask again once something changed', async () => {
    card.set(WEREWOLF_CARD);
    await fixture.whenStable();
    cardButton().click();
    await fixture.whenStable();
    cardButton().click();
    await fixture.whenStable();
    expect(hint()).toBe('');

    card.set({ ...WEREWOLF_CARD, isEnchanted: true });
    await fixture.whenStable();
    expect(hint()).toContain('Tap your card');
  });

  it('should describe the role without the advice meant for the narrator', async () => {
    card.set(WEREWOLF_CARD);
    await fixture.whenStable();
    cardButton().click();
    await fixture.whenStable();

    const titles = [...element().querySelectorAll('article h3')].map((h3) =>
      h3.textContent?.trim(),
    );
    expect(titles.length).toBeGreaterThan(0);
    expect(titles).not.toContain(SectionTitles.hintForTheNarrator);
  });

  it("should turn a dead player's card face up for good", async () => {
    card.set({ ...WEREWOLF_CARD, isDead: true });
    await fixture.whenStable();

    expect(title()).toBe(WEREWOLF.name);
    expect(cardButton().getAttribute('aria-pressed')).toBe('true');
  });
});
