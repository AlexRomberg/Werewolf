import { isDevMode } from "@angular/core";
import { Angel } from "./angel";
import { BearGuide } from "./bearGuide";
import { BigWolf } from "./bigWolf";
import { Bitch } from "./bitch";
import { Brothers } from "./brothers";
import { Cupit } from "./cupit";
import { DogWolf } from "./dogWolf";
import { FlutePlayer } from "./flutePlayer";
import { Fox } from "./fox";
import { Healer } from "./healer";
import { Hunter } from "./hunter";
import { Juggler } from "./juggler";
import { Knight } from "./knight";
import { Old } from "./old";
import { OldMan } from "./oldMan";
import { PrimalWolf } from "./primalWolf";
import { Scapegoat } from "./scapegoat";
import { Seer } from "./seer";
import { Sisters } from "./sisters";
import { SmallChild } from "./smallChild";
import { Thief } from "./thief";
import { VillageIdiot } from "./villageIdiot";
import { Villager } from "./villager";
import { Werewolf } from "./werewolf";
import { WhiteWolf } from "./whiteWolf";
import { WildChild } from "./wildChild";
import { Witch } from "./witch";

export enum BasePriority {
    Initial = 0,
    Wolf = 50,
    PostWolf = 100,
}

export const GroupedRoles = [
    {
        name: "Werwölfe",
        cards: [
            { role: new Werewolf(), selected: isDevMode(), multicard: true },
            { role: new PrimalWolf(), selected: isDevMode() },
            { role: new WildChild(), selected: isDevMode() },
            { role: new WhiteWolf(), selected: isDevMode() },
            { role: new BigWolf(), selected: isDevMode() },
            { role: new DogWolf(), selected: isDevMode() },
        ]
    }, {
        name: "Aktive",
        cards: [
            { role: new Witch(), selected: isDevMode() },
            { role: new Seer(), selected: isDevMode() },
            { role: new Thief(), selected: isDevMode() },
            { role: new Cupit(), selected: isDevMode() },
            { role: new Healer(), selected: isDevMode() },
            { role: new SmallChild(), selected: isDevMode() },
            { role: new Bitch(), selected: isDevMode() },
            { role: new Brothers(), selected: isDevMode(), multicard: true },
            { role: new Sisters(), selected: isDevMode(), multicard: true },
            { role: new Scapegoat(), selected: isDevMode() },
            { role: new Fox(), selected: isDevMode() },
        ]
    }, {
        name: "Passive",
        cards: [
            { role: new Villager(), selected: isDevMode(), multicard: true },
            { role: new Hunter(), selected: isDevMode() },
            { role: new Knight(), selected: isDevMode() },
            { role: new BearGuide(), selected: isDevMode() },
            { role: new Old(), selected: isDevMode() },
            { role: new VillageIdiot(), selected: isDevMode() },
            { role: new Juggler(), selected: isDevMode() },
        ]
    }, {
        name: "Einzelgänger",
        cards: [
            { role: new Angel(), selected: isDevMode() },
            { role: new OldMan(), selected: isDevMode() },
            { role: new FlutePlayer(), selected: isDevMode() },
        ]
    }
];