import { Component, inject } from '@angular/core';
import { NAME_TRANSLATIONS } from '../../../i18n/translations';
import { DialogService } from '../../../services/dialog.service';
import { StateService } from '../../../services/state.service';
import { DialogTypes } from '../../../types';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  imports: [LucideAngularModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  Dialog = inject(DialogService);
  GameState = inject(StateService);
  NAME_TRANSLATIONS = NAME_TRANSLATIONS;
  DialogTypes = DialogTypes;
}
