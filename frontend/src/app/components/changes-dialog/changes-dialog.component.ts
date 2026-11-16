import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { LucideCheck, LucideInfo, LucideUser } from '@lucide/angular';
import { Character } from '../../models/character';
import { HOODRAT, WITCH } from '../../models/characters';
import { ChangeReason, DaybreakChange, PersonView } from '../../services/state/types';
import { ModalDirective } from '../modal/modal.directive';

export interface DaybreakChangeView {
  change: DaybreakChange;
  person: PersonView;
  causedBy: Character | PersonView | undefined;
  appliable: boolean;
  applied: boolean;
}

interface Portrait {
  image: string | null;
  name: string;
}

interface ChangeEntry extends DaybreakChangeView {
  key: string;
  portrait: Portrait;
  causePortrait: Portrait | null;
  headline: string;
  note: string;
}

@Component({
  selector: 'app-changes-dialog',
  imports: [
    NgOptimizedImage,
    NgTemplateOutlet,
    ModalDirective,
    LucideCheck,
    LucideInfo,
    LucideUser,
  ],
  templateUrl: './changes-dialog.component.html',
})
export class ChangesDialogComponent {
  public changes = input.required<readonly DaybreakChangeView[]>();
  public leaving = input(false);

  public applied = output<DaybreakChange>();
  public appliedAll = output<void>();
  public proceeded = output<void>();
  public closed = output<void>();

  protected entries = computed(() => this.changes().map(toEntry));
  protected deaths = computed(() => this.entries().filter((entry) => !isInformational(entry)));
  protected informational = computed(() => this.entries().filter(isInformational));
  protected hasPending = computed(() =>
    this.changes().some((change) => change.appliable && !change.applied),
  );
}

function isInformational(view: DaybreakChangeView) {
  return !view.appliable || view.change.reason === ChangeReason.TurnedIntoWolf;
}

function toEntry(view: DaybreakChangeView): ChangeEntry {
  const { change, person, causedBy } = view;
  const causePortrait = causedBy ? portraitOf(causedBy) : null;

  return {
    ...view,
    key: `${change.personId}:${change.reason}`,
    portrait: portraitOf(person),
    causePortrait,
    ...wording(change, callName(person), midSentence(causePortrait?.name ?? 'someone')),
  };
}

function wording(change: DaybreakChange, name: string, cause: string) {
  const causingRole = 'role' in change.causedBy ? change.causedBy.role : '';

  switch (change.reason) {
    case ChangeReason.DiedGotKilled:
      return {
        headline: `${name} got killed`,
        note: causingRole === WITCH.id ? `Poisoned by ${cause}` : `By ${cause}`,
      };
    case ChangeReason.DiedOfBrokenHeart:
      return { headline: `${name} died of a broken heart`, note: `In love with ${cause}` };
    case ChangeReason.DiedSleptWithVictim:
      return {
        headline: `${name} died, spent the night at the victim's place`,
        note: `Guest of ${cause}`,
      };
    case ChangeReason.TurnedIntoWolf:
      return { headline: `${name} turned into a wolf`, note: `Secret! Role model (${cause}) died` };
    case ChangeReason.SurvivedHostDeath:
      return { headline: `${name} survived`, note: `Host ${cause} did not die by the wolves` };
    case ChangeReason.SurvivedAttack:
      return { headline: `${name} survived the attack`, note: savedNote(causingRole, cause) };
  }
}

function savedNote(savedByRole: string, cause: string) {
  if (savedByRole === WITCH.id) {
    return `Healed by ${cause}`;
  }
  return savedByRole === HOODRAT.id ? 'Not at home' : `Protected by ${cause}`;
}

/** What the narrator calls a player out loud: their name, else their card, else their seat. */
function callName(person: PersonView) {
  const character = person.character;
  return person.name || character?.memberName || character?.name || person.displayName;
}

function portraitOf(subject: Character | PersonView): Portrait {
  if (subject instanceof Character) {
    return { image: subject.image, name: subject.name };
  }
  return { image: subject.character?.image ?? null, name: callName(subject) };
}

function midSentence(name: string) {
  return name.replace(/^The /, 'the ');
}
