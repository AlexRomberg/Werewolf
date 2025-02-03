import { TestBed } from "@angular/core/testing";
import { StateService } from "../../services/state.service";
import { GameSets, GroupTypes } from "../../types";
import { Sisters } from "../../models/characters/implementations/sisters";


describe("Sisters", () => {
    let gameState: StateService;
    let character: Sisters;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(StateService);
        character = new Sisters(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("sisters");
    });

    it("should have correct group", () => {
        expect(character.Group).toBe(GroupTypes.Active);
    });

    it("should have correct game type", () => {
        expect(character.Game).toBe(GameSets.Characters);
    });

    it("should not be single", () => {
        expect(character.IsSingle).toBeFalse();
    });

    it("should have correct priority", () => {
        expect(character.Priority).toBe(6);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight(0)).toBeTrue();
        expect(character.IsAwakeThisNight(1)).toBeFalse();
        expect(character.IsAwakeThisNight(2)).toBeTrue();
    });

    it("should calculate descriptions propperly", () => {
        for (let person = 0; person < 2; person++) {
            expect(character.GetDescriptions().filter(Boolean).length).toBe(2);

            gameState.addPerson();
            gameState.People[person].Character = character;
        }

        expect(character.GetDescriptions().filter(Boolean).length).toBe(1);
    });

    it("should calculate buttons propperly", () => {
        for (let person = 0; person < 2; person++) {
            expect(character.GetButtons().filter(Boolean).length).toBe(1);

            gameState.addPerson();
            gameState.People[person].Character = character;
        }

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
