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
  love: (name) => `You are in love with ${name}.`,
  trust: (name) => `${name} is your role model.`,
  sleepover: (name) => `You sleep over at ${name}'s.`,
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

  protected facts = computed<Fact[]>(() => {
    const card = this.card();
    const states: (Fact | false)[] = [
      card.isDead && { kind: 'dead', tone: 'kill', text: 'You are dead.' },
      card.isWerewolf && { kind: 'werewolf', tone: 'kill', text: 'You hunt with the werewolves.' },
      card.isEnchanted && {
        kind: 'enchanted',
        tone: 'enchant',
        text: 'The piper has enchanted you.',
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
