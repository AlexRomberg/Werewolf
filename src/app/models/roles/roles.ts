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

const SELECTED = true;

export const GroupedRoles = [
    {
        name: "Werwölfe",
        cards: [
            { role: new Werewolf(), selected: SELECTED, multicard: true },
            { role: new PrimalWolf(), selected: SELECTED },
            { role: new WildChild(), selected: SELECTED },
            { role: new WhiteWolf(), selected: SELECTED },
            { role: new BigWolf(), selected: SELECTED },
            { role: new DogWolf(), selected: SELECTED },
        ]
    }, {
        name: "Aktive",
        cards: [
            { role: new Witch(), selected: SELECTED },
            { role: new Seer(), selected: SELECTED },
            { role: new Thief(), selected: SELECTED },
            { role: new Cupit(), selected: SELECTED },
            { role: new Healer(), selected: SELECTED },
            { role: new SmallChild(), selected: SELECTED },
            { role: new Bitch(), selected: SELECTED },
            { role: new Brothers(), selected: SELECTED, multicard: true },
            { role: new Sisters(), selected: SELECTED, multicard: true },
            { role: new Scapegoat(), selected: SELECTED },
            { role: new Fox(), selected: SELECTED },
        ]
    }, {
        name: "Passive",
        cards: [
            { role: new Villager(), selected: SELECTED, multicard: true },
            { role: new Hunter(), selected: SELECTED },
            { role: new Knight(), selected: SELECTED },
            { role: new BearGuide(), selected: SELECTED },
            { role: new Old(), selected: SELECTED },
            { role: new VillageIdiot(), selected: SELECTED },
            { role: new Juggler(), selected: SELECTED },
        ]
    }, {
        name: "Einzelgänger",
        cards: [
            { role: new Angel(), selected: SELECTED },
            { role: new OldMan(), selected: SELECTED },
            { role: new FlutePlayer(), selected: SELECTED },
        ]
    }
];