import { NAME_TRANSLATIONS } from "../../i18n/translations";
import { DialogService } from "../../services/dialog.service";
import { StateService } from "../../services/state.service";
import { ActionProvider } from "../../types";
import { BearGuide } from "../characters/implementations/bearGuide";
import { WerewolfCharacter } from "../characters/werewolfCharacter";

export class RulesAction implements ActionProvider {
    Id = "rules";
    GetActions = () => [
        $localize`:@@actions-rules-1:Regeln erklären`,
        this.getWerewolfCharacters().length > 0 && $localize`:@@actions-rules-2:Anzahl Werwölfe erwähnen (${this.gameState.SelectedCharacters
            .filter((c) => c instanceof WerewolfCharacter)
            .map((c) => NAME_TRANSLATIONS[c.Id as keyof typeof NAME_TRANSLATIONS]).join(", ")})`,
        $localize`:@@actions-rules-3:Einleitende Geschichte erzählen`
    ];
    GetButtons = () => []

    constructor(private gameState: StateService) { }

    private getWerewolfCharacters = () => this.gameState.SelectedCharacters.filter((c) => c instanceof WerewolfCharacter);
};

export const NightfallAction: ActionProvider = {
    Id: "night",
    GetActions: () => [
        $localize`:@@actions-night-1:Und das Dorf schläft ein`
    ],
    GetButtons: () => []
};

export class DaybreakAction implements ActionProvider {
    Id = "day";
    GetActions = () => [
        $localize`:@@actions-day-1:Und das Dorf erwacht`,
        this.gameState.Changes.length > 0 && $localize`:@@actions-day-2:Informiere über Tode (Änderungen anzeigen)`,
        this.gameState.Changes.length <= 0 && $localize`:@@actions-day-3:Keine Tode in der Nacht`,
        this.gameState.SelectedCharacters.some(c => c instanceof BearGuide) && $localize`:@@actions-day-4:Denke an den Bärenführer`,
        $localize`:@@actions-day-5:Leite Diskussion ein`
    ];
    GetButtons = () =>
        this.gameState.Changes.length > 0 ? [
            {
                Title: $localize`:@@actions-day-6:Änderungen anzeigen`,
                Action: ({ Dialog }: { Dialog: DialogService }) => { Dialog.ShowChangesDialog(this.gameState.Changes); }
            }] : [];

    constructor(private gameState: StateService) { }
};
