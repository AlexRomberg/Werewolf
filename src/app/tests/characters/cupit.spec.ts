import { TestBed } from "@angular/core/testing";
import { GameStateService } from "../../services/game-state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../types";
import { Cupit } from "../../models/characters/implementations/cupit";


describe("Cupit", () => {
    let gameState: GameStateService;
    let character: Cupit;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(GameStateService);
        character = new Cupit(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("cupit");
    });

    it("should have correct group", () => {
        expect(character.Group).toBe(GroupTypes.Active);
    });

    it("should have correct game type", () => {
        expect(character.Game).toBe(GameSets.BaseGame);
    });

    it("should be single", () => {
        expect(character.IsSingle).toBeTrue();
    });

    it("should have correct priority", () => {
        expect(character.Priority).toBe(3);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight(0)).toBeTrue();
        expect(character.IsAwakeThisNight(1)).toBeFalse();
        expect(character.IsAwakeThisNight(2)).toBeFalse();
    });

    it("should calculate descriptions propperly", () => {
        expect(character.GetDescriptions().filter(Boolean).length).toBe(3);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetDescriptions().filter(Boolean).length).toBe(2);

        gameState.addPerson();
        gameState.addConnection(ConnectionTypes.Love, gameState.People[0], gameState.People[1]);

        expect(character.GetDescriptions().filter(Boolean).length).toBe(1);
    });

    it("should calculate buttons propperly", () => {
        expect(character.GetButtons().filter(Boolean).length).toBe(2);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetButtons().filter(Boolean).length).toBe(1);

        gameState.addPerson();
        gameState.addConnection(ConnectionTypes.Love, gameState.People[0], gameState.People[1]);

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
