import { TestBed } from "@angular/core/testing";
import { GameStateService } from "../../services/game-state.service";
import { GameSets, GroupTypes } from "../../types";
import { Werewolf } from "../../models/characters/implementations/werewolf";


describe("Werewolf", () => {
    let gameState: GameStateService;
    let character: Werewolf;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(GameStateService);
        character = new Werewolf(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("werewolf");
    });

    it("should have correct group", () => {
        expect(character.Group).toBe(GroupTypes.Wolves);
    });

    it("should have correct game type", () => {
        expect(character.Game).toBe(GameSets.BaseGame);
    });

    it("should be single", () => {
        expect(character.IsSingle).toBeFalse();
    });

    it("should have correct priority", () => {
        expect(character.Priority).toBe(51);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight()).toBeTrue();
    });

    it("should calculate descriptions propperly", () => {
        expect(character.GetDescriptions().filter(Boolean).length).toBe(2);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetDescriptions().filter(Boolean).length).toBe(1);

        gameState.addPerson();
        gameState.People[1].IsVictim = true;
        expect(character.GetDescriptions().filter(Boolean).length).toBe(0);
    });

    it("should calculate buttons propperly", () => {
        expect(character.GetButtons().filter(Boolean).length).toBe(2);

        gameState.addPerson();
        gameState.People[0].Character = character;
        expect(character.GetButtons().filter(Boolean).length).toBe(1);

        gameState.addPerson();
        gameState.People[1].IsVictim = true;
        expect(character.GetButtons().filter(Boolean).length).toBe(0);
    });

    it("should be able to reset after night", () => {
        character.resetAfterNight();
    });

    it("should have no people assigned", () => {
        expect(character["isAssigned"]).toBeFalse();
    });

    it("should have people assigned", () => {
        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character["isAssigned"]).toBeTrue();
    });
});
