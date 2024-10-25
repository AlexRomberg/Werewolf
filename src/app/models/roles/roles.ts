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
            { role: new Werewolf(), selected: false, multicard: true },
            { role: new PrimalWolf(), selected: false },
            { role: new WildChild(), selected: false },
            { role: new WhiteWolf(), selected: false },
            { role: new BigWolf(), selected: false },
            { role: new DogWolf(), selected: false },
        ]
    }, {
        name: "Aktive",
        cards: [
            { role: new Witch(), selected: false },
            { role: new Seer(), selected: false },
            { role: new Thief(), selected: false },
            { role: new Cupit(), selected: false },
            { role: new Healer(), selected: false },
            { role: new SmallChild(), selected: false },
            { role: new Bitch(), selected: false },
            { role: new Brothers(), selected: false, multicard: true },
            { role: new Sisters(), selected: false, multicard: true },
            { role: new Scapegoat(), selected: false },
            { role: new Fox(), selected: false },
        ]
    }, {
        name: "Passive",
        cards: [
            { role: new Villager(), selected: false, multicard: true },
            { role: new Hunter(), selected: false },
            { role: new Knight(), selected: false },
            { role: new BearGuide(), selected: false },
            { role: new Old(), selected: false },
            { role: new VillageIdiot(), selected: false },
            { role: new Juggler(), selected: false },
        ]
    }, {
        name: "Einzelgänger",
        cards: [
            { role: new Angel(), selected: false },
            { role: new OldMan(), selected: false },
            { role: new FlutePlayer(), selected: false },
        ]
    }
];