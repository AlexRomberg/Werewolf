import { Injectable } from '@angular/core';
import { Action, CircleConnection, CirclePerson } from '../types';
import { Witch } from '../models/roles/witch';
import { Role } from '../models/roles/roles';
import { DaybreakAction, NightfallAction, RulesAction } from '../models/actions/generic';
import { Wolvechild } from '../models/roles/wolvechild';
import { Werewolf } from '../models/roles/welewolf';
import { Seer } from '../models/roles/seer';
import { Cupit } from '../models/roles/cupit';
import { Thief } from '../models/roles/thief';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  public Night: number = 0;
  public ActionHistory: Action[] = [];

  public People: CirclePerson[] = [
    { id: 0, name: "A", protected: false, victim: false },
    { id: 1, name: "T", protected: false, victim: false },
    { id: 2, name: "L", protected: false, victim: false },
    { id: 3, name: "A", protected: false, victim: false },
    { id: 4, name: "R", protected: false, victim: false },
    { id: 5, name: "S", protected: false, victim: false },
    { id: 6, name: "N", protected: false, victim: false },
  ];

  public Connections: CircleConnection[] = [
  ]

  public Characters: Role[] = [
    // One time characters ----------
    new Thief(),
    new Cupit(),
    new Wolvechild(),
    // Repeating characters ----------
    new Seer(),
    new Werewolf(),
    new Witch()
  ]

  public Actions: Action[] = []

  public StartGame() {
    this.Night = 0;
    this.Actions.push(RulesAction);
    this.LoadNightActions();
  }

  public LoadNightActions() {
    this.Actions.push(NightfallAction);
    this.Actions.push(...this.Characters
      .filter(c => c.IsAwakeThisNight(this.Night))
      .map(c => c.Action))
    this.Actions.push(DaybreakAction)
  }

  public NextAction() {
    const currentAction = this.Actions.shift();
    if (!currentAction) { return }

    this.ActionHistory.push(currentAction)
    if (this.Actions.length <= 1) {
      this.Night++;
      this.LoadNightActions();
      this.ActionHistory = [];
    }
  }

  public PreviousAction() {
    const lastAction = this.ActionHistory.pop();
    if (!lastAction) { return; }

    this.Actions.unshift(lastAction);
  }
}
