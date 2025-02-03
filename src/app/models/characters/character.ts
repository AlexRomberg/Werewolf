import { ActionButton, ActionProvider as ActionProvider, GameSets, GroupTypes } from "../../types";
import { StateService } from "../../services/state.service";

export abstract class Character implements ActionProvider {
    abstract Id: string;
    abstract Group: GroupTypes;
    abstract Game: GameSets;
    IsSingle = true;
    Priority = -1;

    protected get isAssigned() {
        return this.gameState.getPeopleForCharacter(this).length > 0;
    }

    constructor(protected gameState: StateService) { }
    IsAwakeThisNight = (_round: number, _gameState: StateService) => false;
    resetAfterNight = () => { };

    GetDescriptions = (): (string | false)[] => [];
    GetButtons = (): ActionButton[] => [];
}