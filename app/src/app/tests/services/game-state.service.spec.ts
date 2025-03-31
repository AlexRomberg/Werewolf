import { TestBed } from "@angular/core/testing";

import { StateService } from "../../services/state.service";
import { GameSets, GroupTypes } from "../../types";

describe("GameStateService", () => {
    let service: StateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StateService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should initialize in first night", () => {
        expect(service.Round).toBe(0);
    });

    it("should initialize without people", () => {
        expect(service.People.length).toBe(0);
    });

    it("should add empty person", () => {
        service.addPerson();
        expect(service.People.length).toBe(1);

        const person = service.People[0];
        expect(person.Id).toBeTruthy();
        expect(person.Name).toBe("");
        expect(person.IsDead).toBeFalse();
        expect(person.IsEnchanted).toBeFalse();
        expect(person.IsProtected).toBeFalse();
        expect(person.IsVictim).toBeFalse();
        expect(person.IsWerewolf).toBeFalse();
        expect(person.Character).toBeUndefined();
    });

    it("should set name of person", () => {
        const expectedName = "Mr. Wolf";

        service.addPerson();
        expect(service.People.length).toBe(1);

        const person = service.People[0];
        expect(person.Name).toBe("");

        person.Name = expectedName;
        expect(person.Name).toBe(expectedName);
    });

    it("should filter characters", () => {
        expect(service.AllCharacters.filter(c => c.Group == GroupTypes.Wolves).length).toBe(6);
        expect(service.AllCharacters.filter(c => c.Group == GroupTypes.Active).length).toBe(10);
        expect(service.AllCharacters.filter(c => c.Group == GroupTypes.Passive).length).toBe(10);
        expect(service.AllCharacters.filter(c => c.Group == GroupTypes.Loners).length).toBe(3);

        expect(service.AllCharacters.filter(c => c.Game == GameSets.BaseGame).length).toBe(8);
        expect(service.AllCharacters.filter(c => c.Game == GameSets.Characters).length).toBe(15);
        expect(service.AllCharacters.filter(c => c.Game == GameSets.NewMoon).length).toBe(5);
        expect(service.AllCharacters.filter(c => c.Game == GameSets.Special).length).toBe(1);
    });

    it("should set characters", () => {
        service.SelectedCharacters = service.AllCharacters;

        expect(service.SelectedCharacters.length).toBe(29);
    });

    it("should calculate actions propperly", () => {
        service.SelectedCharacters = service.AllCharacters;

        const actorsFirstNight = service.getActionsForNight();
        const actionsFirstNight = actorsFirstNight.map((a) => a.GetButtons().length).reduce((a, b) => a + b, 0);
        const descriptionsFirstNight = actorsFirstNight.map((a) => a.GetActions().length).reduce((a, b) => a + b, 0);

        service.startNextRound();
        const actorsSecondNight = service.getActionsForNight();
        const actionsSecondNight = actorsSecondNight.map((a) => a.GetButtons().length).reduce((a, b) => a + b, 0);
        const descriptionsSecondNight = actorsSecondNight.map((a) => a.GetActions().length).reduce((a, b) => a + b, 0);

        service.startNextRound();
        const actorsThirdNight = service.getActionsForNight();
        const actionsThirdNight = actorsThirdNight.map((a) => a.GetButtons().length).reduce((a, b) => a + b, 0);
        const descriptionsThirdNight = actorsThirdNight.map((a) => a.GetActions().length).reduce((a, b) => a + b, 0);

        service.startNextRound();
        const actorsFourthNight = service.getActionsForNight();
        const actionsFourthNight = actorsFourthNight.map((a) => a.GetButtons().length).reduce((a, b) => a + b, 0);
        const descriptionsFourthNight = actorsFourthNight.map((a) => a.GetActions().length).reduce((a, b) => a + b, 0);

        service.startNextRound();
        const actorsFifthNight = service.getActionsForNight();
        const actionsFifthNight = actorsFifthNight.map((a) => a.GetButtons().length).reduce((a, b) => a + b, 0);
        const descriptionsFifthNight = actorsFifthNight.map((a) => a.GetActions().length).reduce((a, b) => a + b, 0);

        // Every night (12 Characters, 18 Actions)
        //  - 0x Nightfall
        //  - 0x Daybreak
        //  - 2x Werewolf
        //  - 2x PrimalWolf
        //  - 2x BigWolf
        //  - 3x Witch
        //  - 1x Seer
        //  - 2x FlutePlayer
        //  - 2x Fox
        //  - 1x Hoodrat -> +1 after assignment
        //  - 2x Healer
        //  - 1x Juggler

        // Every even 0, 2, 4 (2 Characters, 2 Actions)
        //  - 1x Brothers
        //  - 1x Sisters

        // Every odd 1, 3, 5 (1 Character, 2 Actions)
        //  - 2x WhiteWolf

        // Once (7 Characters, 8 Actions)
        //  - 0x Rules
        //  - 1x BearGuide
        //  - 1x WildChild -> +1 after assignment
        //  - 1x Thief
        //  - 2x Cupid
        //  - 1x The Old
        //  - 1x Scapegoat

        expect(actorsFirstNight.length).toBe(22);
        expect(actionsFirstNight).toBe(27);
        expect(descriptionsFirstNight).toBe(57);

        expect(actorsSecondNight.length).toBe(13);
        expect(actionsSecondNight).toBe(20);
        expect(descriptionsSecondNight).toBe(33);

        expect(actorsThirdNight.length).toBe(14);
        expect(actionsThirdNight).toBe(20);
        expect(descriptionsThirdNight).toBe(35);

        expect(actorsFourthNight.length).toBe(13);
        expect(actionsFourthNight).toBe(20);
        expect(descriptionsFourthNight).toBe(33);

        expect(actorsFifthNight.length).toBe(14);
        expect(actionsFifthNight).toBe(20);
        expect(descriptionsFifthNight).toBe(35);
    });
});
