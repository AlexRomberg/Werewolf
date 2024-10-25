import { Injectable } from '@angular/core';
import { Action, CircleConnection, CirclePerson, Role } from '../types';
import { DaybreakAction, NightfallAction, RulesAction } from '../models/actions/generic';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  public Night: number = 0;
  public Actions: Action[] = [];
  public ActionHistory: Action[] = [];
  public People: CirclePerson[] = [];
  public Connections: CircleConnection[] = [];
  public Characters: Role[] = [];
  public ActiveCharacters: Role[] = [];
  public ActiveHistoryCharacters: Role[] = [];

  public StartGame() {
    this.Night = 0;
    this.Actions = [];
    this.ActionHistory = [];
    this.Connections = [];

    this.Actions.push(RulesAction);
    this.LoadNightActions();
  }

  public LoadNightActions() {
    this.Actions.push(NightfallAction);
    this.Actions.push(...this.Characters
      .filter(c => c.IsAwakeThisNight(this.Night, this) && c.Action)
      .map(c => c.Action!))
    this.Actions.push(DaybreakAction)
  }

  public NextAction() {
    const currentAction = this.Actions.shift();
    if (!currentAction) { return }

    this.ActionHistory.push(currentAction)
    if (this.Actions.length <= 1) {
      this.handleNightOver()
    }
  }

  public handleNightOver() {
    this.Night++;
    this.LoadNightActions();
    this.ActionHistory = [];

    for (const person of this.People) {
      if (person.victim) {
        person.victim = false;
        person.dead = true;
      }
    }
  }

  public PreviousAction() {
    const lastAction = this.ActionHistory.pop();
    if (!lastAction) { return; }

    this.Actions.unshift(lastAction);
  }
}
