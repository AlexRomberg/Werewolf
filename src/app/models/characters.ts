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
        Name: $localize`:@@setup-werewolfs:Werwölfe`,
        Cards: [
            { Character: new Werewolf(), Selected: false },
            { Character: new PrimalWolf(), Selected: false },
            { Character: new WildChild(), Selected: false },
            { Character: new WhiteWolf(), Selected: false },
            { Character: new BigWolf(), Selected: false },
            { Character: new WolfDog(), Selected: false },
        ]
    }, {
        Name: $localize`:@@setup-active:Aktive`,
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
        Name: $localize`:@@setup-passive:Passive`,
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
        Name: $localize`:@@setup-single-players:Einzelgänger`,
        Cards: [
            { Character: new Angel(), Selected: false },
            { Character: new OldMan(), Selected: false },
            { Character: new FlutePlayer(), Selected: false },
        ]
    }
];

export const NAME_TRANSLATIONS = {
    "rules": $localize`:@@character-name-rules:Regeln & Anfang`,
    "night": $localize`:@@character-name-night:Dämmerung`,
    "day": $localize`:@@character-name-day:Tagesanbruch`,

    "angel": $localize`:@@character-name-angel:Der Engel`,
    "bear_guide": $localize`:@@character-name-bear_guide:Der Bärenführer`,
    "big_wolf": $localize`:@@character-name-big_wolf:Der Grosse, böse Wolf`,
    "bitch": $localize`:@@character-name-bitch:Die Dorfmatratze`,
    "brothers": $localize`:@@character-name-brothers:Die Drei Brüder`,
    "cupit": $localize`:@@character-name-cupit:Der Amor`,
    "flute_player": $localize`:@@character-name-flute_player:Der Flötenspieler`,
    "fox": $localize`:@@character-name-fox:Der Fuchs`,
    "healer": $localize`:@@character-name-healer:Der Heiler`,
    "hunter": $localize`:@@character-name-hunter:Der Jäger`,
    "judge": $localize`:@@character-name-judge:Der Richter`,
    "juggler": $localize`:@@character-name-juggler:Der Gaukler`,
    "knight": $localize`:@@character-name-knight:Der Ritter der rostigen Klinge`,
    "maid": $localize`:@@character-name-maid:Die Ergebene Magd`,
    "old": $localize`:@@character-name-old:Der Alte`,
    "old_man": $localize`:@@character-name-old_man:Der Verbitterte Greis`,
    "primal_wolf": $localize`:@@character-name-primal_wolf:Der Urwolf`,
    "scapegoat": $localize`:@@character-name-scapegoat:Der Sündenbock`,
    "seer": $localize`:@@character-name-seer:Die Seherin`,
    "sisters": $localize`:@@character-name-sisters:Die Zwei Geschwister`,
    "small_child": $localize`:@@character-name-small_child:Das kleine Mädchen`,
    "thief": $localize`:@@character-name-thief:Der Dieb`,
    "village_idiot": $localize`:@@character-name-village_idiot:Der Dorfdepp`,
    "villager": $localize`:@@character-name-villager:Der Einfache Dorfbewohner`,
    "werewolf": $localize`:@@character-name-werewolf:Der Einfache Werewolf`,
    "white_wolf": $localize`:@@character-name-white_wolf:Der weisse Wolf`,
    "wild_child": $localize`:@@character-name-wild_child:Das wilde Kind`,
    "witch": $localize`:@@character-name-witch:Die Hexe`,
    "dog_wolf": $localize`:@@character-name-dog_wolf:Der Wolfshund`,
};