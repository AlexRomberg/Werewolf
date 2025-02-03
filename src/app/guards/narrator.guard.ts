import { inject, isDevMode } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { StateService } from "../services/state.service";

export const narratorGuard: CanActivateFn = () => {
    const gameState = inject(StateService);
    const router = inject(Router);

    if (gameState.People.length > 0 && gameState.SelectedCharacters.length > 0 && gameState.InGame || isDevMode()) {
        return true;
    }

    router.navigateByUrl("/setup");
    return false;
};
