import { TestBed } from "@angular/core/testing";
import { StateService } from "../../services/state.service";
import { GameSets, GroupTypes } from "../../types";
import { Witch } from "../../models/characters/implementations/witch";


describe("Witch", () => {
    let gameState: StateService;
    let character: Witch;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(StateService);
        character = new Witch(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("witch");
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
        expect(character.Priority).toBe(101);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight()).toBeTrue();

        character["hasNegativePotion"] = false;
        character["hasPositivePotion"] = false;
        expect(character.IsAwakeThisNight()).toBeFalse();
    });

    it("should calculate descriptions propperly", () => {
        expect(character.GetActions().filter(Boolean).length).toBe(3);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetActions().filter(Boolean).length).toBe(2);

        character["hasNegativePotion"] = false;
        expect(character.GetActions().filter(Boolean).length).toBe(1);

        character["hasPositivePotion"] = false;
        expect(character.GetActions().filter(Boolean).length).toBe(1);

        character["hasNegativePotion"] = true;
        expect(character.GetActions().filter(Boolean).length).toBe(1);
    });

    it("should calculate buttons propperly", () => {
        expect(character.GetButtons().filter(Boolean).length).toBe(3);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetButtons().filter(Boolean).length).toBe(2);

        character["hasNegativePotion"] = false;
        expect(character.GetButtons().filter(Boolean).length).toBe(1);

        character["hasPositivePotion"] = false;
        expect(character.GetButtons().filter(Boolean).length).toBe(0);

        character["hasNegativePotion"] = true;
        expect(character.GetButtons().filter(Boolean).length).toBe(1);
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
