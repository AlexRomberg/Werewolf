import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  imports: [],
  templateUrl: './toggle-switch.component.html',
})
export class ToggleSwitchComponent {
  public checked = input(false);
  public disabled = input(false);
  public id = input('');

  public checkedChange = output<boolean>();
}
