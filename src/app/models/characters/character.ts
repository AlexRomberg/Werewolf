import { ActionButton, ActionProvider as ActionProvider, GameSets, GroupTypes } from "../../types";
import { GameStateService } from "../../services/game-state.service";

export abstract class Character implements ActionProvider {
    abstract Id: string;
    abstract Group: GroupTypes;
    abstract Game: GameSets;
    IsSingle = true;
    Priority = -1;

    protected get isAssigned() {
        return this.gameState.getPeopleForCharacter(this).length > 0;
    }

    constructor(protected gameState: GameStateService) { }
    IsAwakeThisNight = (_round: number, _gameState: GameStateService) => false;
    resetAfterNight = () => { };

    GetDescriptions = (): (string | false)[] => [];
    GetButtons = (): ActionButton[] => [];
}