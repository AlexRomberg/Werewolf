import { TestBed } from "@angular/core/testing";
import { GameStateService } from "../../services/game-state.service";
import { GameSets, GroupTypes } from "../../types";
import { Knight } from "../../models/characters/implementations/knight";


describe("Knight", () => {
    let gameState: GameStateService;
    let character: Knight;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(GameStateService);
        character = new Knight(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("knight");
    });

    it("should have correct group", () => {
        expect(character.Group).toBe(GroupTypes.Passive);
    });

    it("should have correct game type", () => {
        expect(character.Game).toBe(GameSets.Characters);
    });

    it("should be single", () => {
        expect(character.IsSingle).toBeTrue();
    });

    it("should have correct priority", () => {
        expect(character.Priority).toBe(-1);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight(0, gameState)).toBeFalse();
        expect(character.IsAwakeThisNight(1, gameState)).toBeFalse();
        expect(character.IsAwakeThisNight(2, gameState)).toBeFalse();
    });

    it("should calculate descriptions propperly", () => {
        expect(character.GetDescriptions().filter(Boolean).length).toBe(0);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetDescriptions().filter(Boolean).length).toBe(0);
    });

    it("should calculate buttons propperly", () => {
        expect(character.GetButtons().filter(Boolean).length).toBe(0);

        gameState.addPerson();
        gameState.People[0].Character = character;
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
