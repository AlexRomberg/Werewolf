import { Angel } from "./characters/angel";
import { BearGuide } from "./characters/bearGuide";
import { BigWolf } from "./characters/bigWolf";
import { Bitch } from "./characters/bitch";
import { Brothers } from "./characters/brothers";
import { Cupit } from "./characters/cupit";
import { WolfDog } from "./characters/wolfDog";
import { FlutePlayer } from "./characters/flutePlayer";
import { Fox } from "./characters/fox";
import { Healer } from "./characters/healer";
import { Hunter } from "./characters/hunter";
import { Juggler } from "./characters/juggler";
import { Knight } from "./characters/knight";
import { Old } from "./characters/old";
import { OldMan } from "./characters/oldMan";
import { PrimalWolf } from "./characters/primalWolf";
import { Scapegoat } from "./characters/scapegoat";
import { Seer } from "./characters/seer";
import { Sisters } from "./characters/sisters";
import { SmallChild } from "./characters/smallChild";
import { Thief } from "./characters/thief";
import { VillageIdiot } from "./characters/villageIdiot";
import { Villager } from "./characters/villager";
import { Werewolf } from "./characters/werewolf";
import { WhiteWolf } from "./characters/whiteWolf";
import { WildChild } from "./characters/wildChild";
import { Witch } from "./characters/witch";
import { CharacterGroup } from "../types";

export enum BasePriority {
    Initial = 0,
    Wolf = 50,
    PostWolf = 100,
}

export const GroupedRoles: CharacterGroup[] = [
    {
        Name: "Werwölfe",
        Cards: [
            { Character: new Werewolf(), Selected: false },
            { Character: new PrimalWolf(), Selected: false },
            { Character: new WildChild(), Selected: false },
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
            { Character: new Cupit(), Selected: false },
            { Character: new Healer(), Selected: false },
            { Character: new SmallChild(), Selected: false },
            { Character: new Bitch(), Selected: false },
            { Character: new Brothers(), Selected: false },
            { Character: new Sisters(), Selected: false },
            { Character: new Scapegoat(), Selected: false },
            { Character: new Fox(), Selected: false },
        ]
    }, {
        Name: "Passive",
        Cards: [
            { Character: new Villager(), Selected: false },
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