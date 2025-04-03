import { TestBed } from "@angular/core/testing";
import { StateService } from "../../services/state.service";
import { GameSets, GroupTypes } from "../../types";
import { BearGuide } from "../../models/characters/implementations/bearGuide";


describe("BearGuide", () => {
    let gameState: StateService;
    let character: BearGuide;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(StateService);
        character = new BearGuide(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("bear_guide");
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
        expect(character.Priority).toBe(9);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight(0)).toBeTrue();
        expect(character.IsAwakeThisNight(1)).toBeFalse();
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
