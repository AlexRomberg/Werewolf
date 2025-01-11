import { Component, inject } from "@angular/core";
import { CardSelectionInformation, CharacterGroup } from "../../../types";
import { CardComponent } from "../../../components/setup/card/card.component";
import { StorageService } from "../../../services/storage.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-cards",
    imports: [CardComponent, RouterLink],
    templateUrl: "./cards.component.html",
    styleUrl: "./cards.component.css"
})
export class CardsComponent {
    private storage = inject(StorageService);
    public Roles: CharacterGroup[] = this.storage.SetupSelection;

    public HandleSelectionStateChange(card: CardSelectionInformation, selected: boolean): void {
        card.Selected = selected;
        this.storage.SetupSelection = this.Roles;
    }

    public GetSelectedCardsCount(): number {
        return this.Roles
            .map(r => r.Cards)
            .flat()
            .filter(r => r.Selected).length;
    }
}
