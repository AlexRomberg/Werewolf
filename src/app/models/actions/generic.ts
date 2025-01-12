import { Action } from "../../types";

export const RulesAction: Action = {
    Id: "rules",
    GetPoints: () => [
        $localize`:@@actions-rules-1:Regeln erklären`,
        $localize`:@@actions-rules-2:Anzahl Werwölfe erwähnen`,
        $localize`:@@actions-rules-3:Einleitende Geschichte erzählen`
    ]
};

export const NightfallAction: Action = {
    Id: "night",
    GetPoints: () => [
        $localize`:@@actions-night-1:Und das Dorf schläft ein`
    ]
};

export const DaybreakAction: Action = {
    Id: "day",
    GetPoints: () => [
        $localize`:@@actions-day-1:Und das Dorf erwacht`,
        $localize`:@@actions-day-2:Informiere über Tode`,
        $localize`:@@actions-day-3:Denke an den Bärenführer`,
        $localize`:@@actions-day-4:Leite Diskussion ein`
    ]
};