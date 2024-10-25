import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GameStateService } from "../services/game-state.service";

export const narratorGuard: CanActivateFn = () => {
    const gameState = inject(GameStateService);
    const router = inject(Router);

    if (gameState.People.length > 0) {
        return true;
    }

    router.navigateByUrl("/");
    return false;
};
