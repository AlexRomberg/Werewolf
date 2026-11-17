import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
  LucideHandshake,
  LucideHeart,
  LucideHouse,
  LucidePawPrint,
  LucideSkull,
  LucideWandSparkles,
  LucideTombstone,
} from '@lucide/angular';
import type { LinkType, PlayerCard } from '@protocol';
import { ActionTone } from '../../models/actions/action';
import { Character } from '../../models/character';

type FactKind = LinkType | 'dead' | 'werewolf' | 'enchanted';

interface Fact {
  kind: FactKind;
  tone: ActionTone;
  text: string;
}

const LINK_TEXT: Record<LinkType, (name: string) => string> = {
  love: (name) => $localize`:@@playerCard.love:You are in love with ${name}:name:.`,
  trust: (name) => $localize`:@@playerCard.trust:${name}:name: is your role model.`,
  sleepover: (name) => $localize`:@@playerCard.sleepover:You sleep over at ${name}:name:'s.`,
};

@Component({
  selector: 'app-player-card',
  imports: [
    NgOptimizedImage,
    LucideHandshake,
    LucideHeart,
    LucideHouse,
    LucidePawPrint,
    LucideWandSparkles,
    LucideTombstone,
  ],
  templateUrl: './player-card.component.html',
  host: {
    class: 'flex flex-col items-center',
  },
})
export class PlayerCardComponent {
  public card = input.required<PlayerCard>();
  public character = input<Character | null>(null);
  public faceUp = input(false);

  public flipPressed = output<void>();

  protected readonly faceDownLabel = $localize`:@@playerCard.faceDown:Turn your card face down`;
  protected readonly turnAroundLabel = $localize`:@@playerCard.turnAround:Turn your card around`;

  protected facts = computed<Fact[]>(() => {
    const card = this.card();
    const states: (Fact | false)[] = [
      card.isDead && {
        kind: 'dead',
        tone: 'kill',
        text: $localize`:@@playerCard.dead:You are dead.`,
      },
      card.isWerewolf && {
        kind: 'werewolf',
        tone: 'kill',
        text: $localize`:@@playerCard.werewolf:You hunt with the werewolves.`,
      },
      card.isEnchanted && {
        kind: 'enchanted',
        tone: 'enchant',
        text: $localize`:@@playerCard.enchanted:The piper has enchanted you.`,
      },
    ];
    const links = card.links.map(({ type, name }): Fact => ({
      kind: type,
      tone: 'bond',
      text: LINK_TEXT[type](name),
    }));
    return [...states.filter((fact) => fact !== false), ...links];
  });
}
