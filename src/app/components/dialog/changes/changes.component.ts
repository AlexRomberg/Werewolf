import { Component, inject } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { DaybreakChange, DialogTypes } from '../../../types';
import { LucideAngularModule } from 'lucide-angular';
import { CHANGE_TRANSLATIONS } from '../../../i18n/translations';

@Component({
  selector: 'app-changes',
  imports: [LucideAngularModule],
  templateUrl: './changes.component.html',
  styleUrl: './changes.component.css'
})
export class ChangesComponent {
  Dialog = inject(DialogService);
  DialogTypes = DialogTypes;

  public getFilteredChanges = (changes: DaybreakChange[]) => {
    return changes.filter(change => !change.isApplied);
  };

  public getChangeUser = (change: DaybreakChange) => {
    return change.person.Name || $localize`:@@changes-unnamed-player:Unbenannter Spieler`;
  };

  public getChangeDescription = (change: DaybreakChange) => {
    return CHANGE_TRANSLATIONS[change.reason];
  };

  public applyChange = (change: DaybreakChange) => {
    change.apply();
    change.isApplied = true;
  }
}
