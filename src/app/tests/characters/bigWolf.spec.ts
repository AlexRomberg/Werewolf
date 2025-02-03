import { TestBed } from "@angular/core/testing";
import { StateService } from "../../services/state.service";
import { GameSets, GroupTypes } from "../../types";
import { BigWolf } from "../../models/characters/implementations/bigWolf";
import { Werewolf } from "../../models/characters/implementations/werewolf";
import { Villager } from "../../models/characters/implementations/villager";
import { WhiteWolf } from "../../models/characters/implementations/whiteWolf";
import { PrimalWolf } from "../../models/characters/implementations/primalWolf";

describe("BigWolf", () => {
    let gameState: StateService;
    let character: BigWolf;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        gameState = TestBed.inject(StateService);
        character = new BigWolf(gameState);
    });

    it("should be created", () => {
        expect(character).toBeTruthy();
    });

    it("should have correct id", () => {
        expect(character.Id).toBe("big_wolf");
    });

    it("should have correct group", () => {
        expect(character.Group).toBe(GroupTypes.Wolves);
    });

    it("should have correct game type", () => {
        expect(character.Game).toBe(GameSets.Characters);
    });

    it("should be single", () => {
        expect(character.IsSingle).toBeTrue();
    });

    it("should have correct priority", () => {
        expect(character.Priority).toBe(54);
    });

    it("should calculate awake state propperly", () => {
        expect(character.IsAwakeThisNight(0, gameState)).toBeTrue();
        expect(character.IsAwakeThisNight(1, gameState)).toBeTrue();
        expect(character.IsAwakeThisNight(2, gameState)).toBeTrue();
    });

    it("should calculate awake state propperly with dead werewolf", () => {
        gameState.addPerson();
        gameState.People[0].IsDead = true;

        gameState.People[0].Character = new Werewolf(gameState);
        expect(character.IsAwakeThisNight(0, gameState)).toBeFalse();

        gameState.People[0].Character = new PrimalWolf(gameState);
        expect(character.IsAwakeThisNight(0, gameState)).toBeFalse();

        gameState.People[0].Character = new WhiteWolf(gameState);
        expect(character.IsAwakeThisNight(0, gameState)).toBeFalse();
    });

    it("should calculate awake state propperly with dead mutant", () => {
        gameState.addPerson();
        gameState.People[0].Character = new Villager(gameState);
        gameState.People[0].IsDead = true;
        gameState.People[0].IsWerewolf = true;
        expect(character.IsAwakeThisNight(0, gameState)).toBeFalse();
    });

    it("should calculate descriptions propperly", () => {
        expect(character.GetDescriptions().filter(Boolean).length).toBe(2);

        gameState.addPerson();
        gameState.People[0].Character = character;

        expect(character.GetDescriptions().filter(Boolean).length).toBe(1);

        character["isDone"] = true;
        expect(character.GetDescriptions().filter(Boolean).length).toBe(0);
    });

    it("should calculate buttons propperly", () => {
        expect(character.GetButtons().filter(Boolean).length).toBe(2);

        gameState.addPerson();
        gameState.People[0].Character = character;
        expect(character.GetButtons().filter(Boolean).length).toBe(1);

        character["isDone"] = true;
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
