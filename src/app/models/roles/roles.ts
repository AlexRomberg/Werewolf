import { isDevMode } from "@angular/core";
import { Angel } from "./angel";
import { BearGuide } from "./bearGuide";
import { BigWolf } from "./bigWolf";
import { Bitch } from "./bitch";
import { Brothers } from "./brothers";
import { Cupit } from "./cupit";
import { WolfDog } from "./wolfDog";
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
import { CharacterGroup } from "../../types";

export enum BasePriority {
    Initial = 0,
    Wolf = 50,
    PostWolf = 100,
}

export const GroupedRoles: CharacterGroup[] = [
    {
        Name: "Werwölfe",
        Cards: [
            { Character: new Werewolf(), Selected: isDevMode(), Multicard: true },
            { Character: new PrimalWolf(), Selected: false },
            { Character: new WildChild(), Selected: isDevMode() },
            { Character: new WhiteWolf(), Selected: false },
            { Character: new BigWolf(), Selected: false },
            { Character: new WolfDog(), Selected: false },
        ]
    }, {
        Name: "Aktive",
        Cards: [
            { Character: new Witch(), Selected: false },
            { Character: new Seer(), Selected: false },
            { Character: new Thief(), Selected: false },
            { Character: new Cupit(), Selected: isDevMode() },
            { Character: new Healer(), Selected: false },
            { Character: new SmallChild(), Selected: false },
            { Character: new Bitch(), Selected: isDevMode() },
            { Character: new Brothers(), Selected: false, Multicard: true },
            { Character: new Sisters(), Selected: false, Multicard: true },
            { Character: new Scapegoat(), Selected: false },
            { Character: new Fox(), Selected: false },
        ]
    }, {
        Name: "Passive",
        Cards: [
            { Character: new Villager(), Selected: false, Multicard: true },
            { Character: new Hunter(), Selected: false },
            { Character: new Knight(), Selected: false },
            { Character: new BearGuide(), Selected: false },
            { Character: new Old(), Selected: false },
            { Character: new VillageIdiot(), Selected: false },
            { Character: new Juggler(), Selected: false },
        ]
    }, {
        Name: "Einzelgänger",
        Cards: [
            { Character: new Angel(), Selected: false },
            { Character: new OldMan(), Selected: false },
            { Character: new FlutePlayer(), Selected: false },
        ]
    }
];