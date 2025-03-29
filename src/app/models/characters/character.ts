import { ActionButton, ActionProvider as ActionProvider, GameSets, GroupTypes } from "../../types";
import { StateService } from "../../services/state.service";

export abstract class Character implements ActionProvider {
    abstract readonly Id: string;
    abstract readonly Group: GroupTypes;
    abstract readonly Game: GameSets;
    readonly IsSingle: boolean = true;
    readonly Priority: number = -1;
    abstract readonly Description: { title: string, description: string }[];

    protected get isAssigned() {
        return this.gameState.getPeopleForCharacter(this).length > 0;
    }

    constructor(protected gameState: StateService) { }
    IsAwakeThisNight = (_round: number, _gameState: StateService) => false;
    resetAfterNight = () => { };

    GetActions = (): (string | false)[] => [];
    GetButtons = (): ActionButton[] => [];
}