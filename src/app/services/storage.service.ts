import { Injectable, isDevMode } from "@angular/core";
import { CharacterGroup } from "../types";
import { GroupedRoles } from "../models/characters/roles";

@Injectable({
    providedIn: "root"
})
export class StorageService {
    // Setup
    public get SetupSelection(): CharacterGroup[] {
        const selection: boolean[][] = JSON.parse(localStorage.getItem("setup_selected_cards") ?? "[]");
        const selectionGroups = GroupedRoles;
        for (let group = 0; group < selectionGroups.length; group++) {
            for (let selectionIdx = 0; selectionIdx < selectionGroups[group].Cards.length; selectionIdx++) {
                if (selection?.[group]?.[selectionIdx]) {
                    selectionGroups[group].Cards[selectionIdx].Selected = selection[group][selectionIdx];
                }
            }
        }
        return selectionGroups;
    }
    public set SetupSelection(selectionGroups: CharacterGroup[]) {
        const slection = selectionGroups.map(v => v.Cards.map(c => c.Selected));
        localStorage.setItem("setup_selected_cards", JSON.stringify(slection));
    }

    public get SetupPeopleCount(): number {
        return Number(localStorage.getItem("setup_people_count") ?? (isDevMode() ? 20 : 1));
    }
    public set SetupPeopleCount(selectionGroups: number) {
        localStorage.setItem("setup_people_count", selectionGroups.toString());
    }
}
