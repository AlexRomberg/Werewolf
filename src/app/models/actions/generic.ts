import { CHANGE_TRANSLATIONS, NAME_TRANSLATIONS } from "../../i18n/translations";
import { StateService } from "../../services/state.service";
import { ActionProvider, DaybreakChange as DaybreakChange } from "../../types";
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
        this.gameState.Changes.length > 0 && $localize`:@@actions-day-2:Informiere über Tode:`,
        ...this.gameState.Changes.map(change => this.getChangeDescription(change)),
        this.gameState.Changes.length <= 0 && $localize`:@@actions-day-3:Keine Tode in der Nacht`,
        this.gameState.SelectedCharacters.some(c => c instanceof BearGuide) && $localize`:@@actions-day-4:Denke an den Bärenführer`,
        $localize`:@@actions-day-5:Leite Diskussion ein`
    ];
    GetButtons = () =>
        this.gameState.Changes.length > 0 ? [
            {
                Title: $localize`:@@actions-day-6:Änderungen bestätigen`,
                Action: () => { this.gameState.Changes.forEach(change => change.apply()); }
            }, {
                Title: $localize`:@@actions-day-7:Änderungen verwerfen`,
                Action: () => { this.gameState.Changes = []; }
            }] : [];

    constructor(private gameState: StateService) { }

    private getChangeDescription = (change: DaybreakChange) => {
        return ` ${change.person.Name || "Unbenannter Spieler"}${change.person.Character?.Id ? `(${NAME_TRANSLATIONS[change.person.Character.Id as keyof typeof NAME_TRANSLATIONS]})` : ''} > ${CHANGE_TRANSLATIONS[change.reason]}`;
    };
};
