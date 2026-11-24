import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { LucideCheck, LucideInfo, LucideUser } from '@lucide/angular';
import { Character } from '../../models/character';
import { ELDER, HOODRAT, KNIGHT, WITCH } from '../../models/characters';
import { ChangeReason, DaybreakChange, PersonView } from '../../services/state/types';
import { CornersComponent } from '../corners/corners.component';
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
    CornersComponent,
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

const SECRET_CHANGES: readonly ChangeReason[] = [
  ChangeReason.TurnedIntoWolf,
  ChangeReason.WoundedByTheKnight,
];

function isInformational(view: DaybreakChangeView) {
  return !view.appliable || SECRET_CHANGES.includes(view.change.reason);
}

function toEntry(view: DaybreakChangeView): ChangeEntry {
  const { change, person, causedBy } = view;
  const causePortrait = causedBy ? portraitOf(causedBy) : null;

  return {
    ...view,
    key: `${change.personId}:${change.reason}`,
    portrait: portraitOf(person),
    causePortrait,
    ...wording(
      change,
      callName(person),
      midSentence(causePortrait?.name ?? $localize`:@@changes.someone:someone`),
    ),
  };
}

function wording(change: DaybreakChange, name: string, cause: string) {
  const causingRole = 'role' in change.causedBy ? change.causedBy.role : '';

  switch (change.reason) {
    case ChangeReason.DiedGotKilled:
      return {
        headline: $localize`:@@changes.killed:${name}:name: got killed`,
        note: killedNote(causingRole, cause),
      };
    case ChangeReason.DiedOfBrokenHeart:
      return {
        headline: $localize`:@@changes.brokenHeart:${name}:name: died of a broken heart`,
        note: $localize`:@@changes.inLoveWith:In love with ${cause}:cause:`,
      };
    case ChangeReason.DiedSleptWithVictim:
      return {
        headline: $localize`:@@changes.sleptWithVictim:${name}:name: died, spent the night at the victim's place`,
        note: $localize`:@@changes.guestOf:Guest of ${cause}:cause:`,
      };
    case ChangeReason.TurnedIntoWolf:
      return {
        headline: $localize`:@@changes.turnedWolf:${name}:name: turned into a wolf`,
        note: $localize`:@@changes.roleModelDied:Secret! Role model (${cause}:cause:) died`,
      };
    case ChangeReason.SurvivedHostDeath:
      return {
        headline: $localize`:@@changes.survived:${name}:name: survived`,
        note: $localize`:@@changes.hostNotKilledByWolves:Host ${cause}:cause: did not die by the wolves`,
      };
    case ChangeReason.SurvivedAttack:
      return {
        headline: $localize`:@@changes.survivedAttack:${name}:name: survived the attack`,
        note: savedNote(causingRole, cause),
      };
    case ChangeReason.WoundedByTheKnight:
      return {
        headline: $localize`:@@changes.woundedByTheKnight:${name}:name: was wounded by the Knight`,
        note: $localize`:@@changes.diesTonight:Secret! Dies tonight`,
      };
  }
}

function killedNote(killedByRole: string, cause: string) {
  switch (killedByRole) {
    case WITCH.id:
      return $localize`:@@changes.poisonedBy:Poisoned by ${cause}:cause:`;
    case KNIGHT.id:
      return $localize`:@@changes.woundedByKnight:Wounded by the rusty blade`;
    default:
      return $localize`:@@changes.killedBy:By ${cause}:cause:`;
  }
}

function savedNote(savedByRole: string, cause: string) {
  switch (savedByRole) {
    case WITCH.id:
      return $localize`:@@changes.healedBy:Healed by ${cause}:cause:`;
    case HOODRAT.id:
      return $localize`:@@changes.notAtHome:Not at home`;
    case ELDER.id:
      return $localize`:@@changes.lostExtraLife:Lost the extra life`;
    default:
      return $localize`:@@changes.protectedBy:Protected by ${cause}:cause:`;
  }
}

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
