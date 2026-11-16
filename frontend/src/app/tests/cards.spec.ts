import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CHARACTERS } from '../models/characters';
import { characterSections } from '../models/characters/sections';
import { CardsComponent } from '../pages/cards/cards.component';

describe('characterSections', () => {
  it('should sort every character into exactly one section, either way', () => {
    for (const grouping of ['game', 'group'] as const) {
      const sorted = characterSections(grouping).flatMap((section) => section.characters);

      expect(sorted.length).toBe(CHARACTERS.length);
      expect(new Set(sorted).size).toBe(CHARACTERS.length);
    }
  });

  it('should lead a section with the cards that are dealt in bulk', () => {
    const baseGame = characterSections('game')[0];

    expect(baseGame.label).toBe('Base Game');
    expect(
      baseGame.characters
        .slice(0, 2)
        .map((character) => character.id)
        .sort(),
    ).toEqual(['villager', 'werewolf']);
  });
});

describe('CardsComponent', () => {
  let fixture: ComponentFixture<CardsComponent>;

  const page = () => fixture.nativeElement as HTMLElement;
  const headings = () => [...page().querySelectorAll('h2')].map((h) => h.textContent?.trim());

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(CardsComponent);
    await fixture.whenStable();
  });

  it('should show a tile for every character', () => {
    expect(page().querySelectorAll('app-character-tile').length).toBe(CHARACTERS.length);
  });

  it('should regroup the characters on request', async () => {
    expect(headings()).toContain('Base Game');

    [...page().querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Group')?.click();
    await fixture.whenStable();

    expect(headings()).toEqual(['Wolves', 'Active', 'Passive', 'Loners']);
  });
});
