import { Injectable } from '@angular/core';
import { Action, CircleConnection, CircleConnectionTypes, CirclePerson } from '../types';
import { Whitch } from '../models/roles/whitch';
import { Role } from '../models/roles/roles';
import { RulesAction } from '../models/actions/generic';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  public Night: number = 0;

  public People: CirclePerson[] = [
    { name: "A", protected: true },
    { name: "T", protected: false },
    { name: "L", protected: false },
    { name: "A", protected: false },
    { name: "R", protected: false },
    { name: "S", protected: false },
    { name: "N", protected: false },
  ];

  public Connections: CircleConnection[] = [
    { type: CircleConnectionTypes.Love, from: 1, to: 4 },
    { type: CircleConnectionTypes.Love, from: 1, to: 4 },
    { type: CircleConnectionTypes.Love, from: 1, to: 4 },
    { type: CircleConnectionTypes.Sleepover, from: 3, to: 5 },
    { type: CircleConnectionTypes.Love, from: 3, to: 5 },
    { type: CircleConnectionTypes.Trust, from: 3, to: 5 },
    { type: CircleConnectionTypes.Trust, from: 2, to: 6 },

    { type: CircleConnectionTypes.Trust, from: 0, to: 3 },
    { type: CircleConnectionTypes.Trust, from: 0, to: 3 },
    { type: CircleConnectionTypes.Trust, from: 0, to: 3 },
    { type: CircleConnectionTypes.Trust, from: 0, to: 3 },

    { type: CircleConnectionTypes.Trust, from: 2, to: 4 },
  ]

  public Characters: Role[] = [
    new Whitch()
  ]

  public Actions: Action[] = []

  public StartGame() {
    this.Night = 0;
    this.Actions.push(RulesAction);
    this.LoadNightActions();
  }

  public LoadNightActions() {
    this.Actions.push(...this.Characters
      .filter(c => c.IsAwakeThisNight(this.Night))
      .map(c => c.Action))
  }
}
