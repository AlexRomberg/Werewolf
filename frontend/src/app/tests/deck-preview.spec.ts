import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckPreviewComponent } from '../components/deck-preview/deck-preview.component';
import { VILLAGER, WEREWOLF } from '../models/characters';

describe('DeckPreviewComponent', () => {
  let fixture: ComponentFixture<DeckPreviewComponent>;

  const images = () => [...(fixture.nativeElement as HTMLElement).querySelectorAll('img')];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DeckPreviewComponent);
  });

  it('should show one image per card, duplicates included', async () => {
    fixture.componentRef.setInput('cards', [WEREWOLF, WEREWOLF, VILLAGER]);
    await fixture.whenStable();

    expect(images().map((image) => image.alt)).toEqual([
      `card ${WEREWOLF.name}`,
      `card ${WEREWOLF.name}`,
      `card ${VILLAGER.name}`,
    ]);
  });

  it('should show nothing for an empty deck', async () => {
    fixture.componentRef.setInput('cards', []);
    await fixture.whenStable();

    expect(images()).toEqual([]);
  });
});
