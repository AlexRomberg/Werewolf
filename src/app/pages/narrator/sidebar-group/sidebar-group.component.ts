import { Component, input, OnInit, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar-group',
  imports: [LucideAngularModule],
  templateUrl: './sidebar-group.component.html',
  styleUrl: './sidebar-group.component.css'
})
export class SidebarGroupComponent implements OnInit {
  public collapsedOnStart = input(false);
  public isClosed = signal(this.collapsedOnStart());
  public title = input.required();
  public summary = input<string>();

  public ngOnInit(): void {
    this.isClosed.set(this.collapsedOnStart());
  }
}
