import { TestBed } from "@angular/core/testing";
import { StateService } from "../../services/state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../types";
import { Bitch } from "../../models/characters/implementations/bitch";


describe("Bitch", () => {
    let gameState: StateService;
    let character: Bitch;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(StateService);
        character = new Bitch(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("bitch");
    });

    it("should have correct group", () => {
        expect(character.Group).toBe(GroupTypes.Active);
    });

    it("should have correct game type", () => {
        expect(character.Game).toBe(GameSets.Special);
    });

    it("should be single", () => {
        expect(character.IsSingle).toBeTrue();
    });

    it("should have correct priority", () => {
        expect(character.Priority).toBe(11);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight()).toBeTrue();
    });

    it("should calculate descriptions propperly", () => {
        expect(character.GetActions().filter(Boolean).length).toBe(2);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetActions().filter(Boolean).length).toBe(1);
    });

    it("should calculate buttons propperly", () => {
        expect(character.GetButtons().filter(Boolean).length).toBe(1);

        gameState.addPerson();
        gameState.People[0].Character = character;
        expect(character.GetButtons().filter(Boolean).length).toBe(1);

        gameState.addPerson();
        gameState.addConnection(ConnectionTypes.Sleepover, gameState.People[0], gameState.People[1]);

        expect(character.GetButtons().filter(Boolean).length).toBe(0);
    });

    it("should be able to reset after night", () => {
        gameState.addPerson();
        gameState.addPerson();
        gameState.addConnection(ConnectionTypes.Sleepover, gameState.People[0], gameState.People[1]);
        expect(gameState.Connections.length).toBe(1);

        character.resetAfterNight();
        expect(gameState.Connections.length).toBe(0);
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
