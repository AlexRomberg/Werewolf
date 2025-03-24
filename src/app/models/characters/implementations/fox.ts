import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Fox extends Character {
    Id = "fox";
    Group = GroupTypes.Active;
    Game = GameSets.Characters;
    override Priority = BasePriority.Initial + 5;
    private hasMisssed = false;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.hasMisssed && this.gameState.Round > 0 && $localize`:@@character-action-fox-2:Darf auf Person zeigen. Wenn diese / einer ihrer Nachbarn ein Werwolf ist, bestätigen`,
        this.hasMisssed && $localize`:@@character-action-fox-3:Hat keine Funktion mehr in dieser Nacht`
    ];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.hasMisssed && this.gameState.Round > 0) {
            buttons.push({
                Title: $localize`:@@character-button-fox-1:Hat verfehlt`,
                Action: () => {
                    this.hasMisssed = true;
                }
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = () => !this.hasMisssed;
}