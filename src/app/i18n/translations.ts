import { ChangeReason, GameSets, GroupTypes } from "../types";

export const NAME_TRANSLATIONS = {
    "rules": $localize`:@@character-name-rules:Regeln & Anfang`,
    "night": $localize`:@@character-name-night:Dämmerung`,
    "day": $localize`:@@character-name-day:Tagesanbruch`,

    "angel": $localize`:@@character-name-angel:Der Engel`,
    "bear_guide": $localize`:@@character-name-bear_guide:Der Bärenführer`,
    "big_wolf": $localize`:@@character-name-big_wolf:Der Grosse, böse Wolf`,
    "hoodrat": $localize`:@@character-name-hoodrat:Die Dorfmatratze`,
    "brothers": $localize`:@@character-name-brothers:Die Drei Brüder`,
    "cupid": $localize`:@@character-name-cupid:Der Amor`,
    "flute_player": $localize`:@@character-name-flute_player:Der Flötenspieler`,
    "fox": $localize`:@@character-name-fox:Der Fuchs`,
    "healer": $localize`:@@character-name-healer:Der Heiler`,
    "hunter": $localize`:@@character-name-hunter:Der Jäger`,
    "judge": $localize`:@@character-name-judge:Der Richter`,
    "juggler": $localize`:@@character-name-juggler:Der Gaukler`,
    "knight": $localize`:@@character-name-knight:Der Ritter der rostigen Klinge`,
    "maid": $localize`:@@character-name-maid:Die Ergebene Magd`,
    "old_man": $localize`:@@character-name-old_man:Der Alte`,
    "bitter_old_man": $localize`:@@character-name-bitter_old_man:Der Verbitterte Greis`,
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
    "wolfdog": $localize`:@@character-name-wolfdog:Der Wolfshund`,
};

export const GROUP_TRANSLATIONS = {
    [GroupTypes.Wolves]: $localize`:@@setup-werewolfs:Werwölfe`,
    [GroupTypes.Active]: $localize`:@@setup-active:Aktive`,
    [GroupTypes.Passive]: $localize`:@@setup-passive:Passive`,
    [GroupTypes.Loners]: $localize`:@@setup-single-players:Einzelgänger`
};

export const GAME_SET_TRANSLATIONS = {
    [GameSets.BaseGame]: $localize`:@@setup-base-game:Grundspiel`,
    [GameSets.NewMoon]: $localize`:@@setup-new-moon:Neumond`,
    [GameSets.Characters]: $localize`:@@setup-characters:Charaktere`,
    [GameSets.Special]: $localize`:@@setup-special:Spezielle`
};

export const CHANGE_TRANSLATIONS = {
    [ChangeReason.DiedGotKilled]: $localize`:@@change-died-got-killed:gestorben (Opfer von Werwolf/Hexe)`,
    [ChangeReason.DiedOfBrokenHeart]: $localize`:@@change-died-of-broken-heart:gestorben (Liebeskummer)`,
    [ChangeReason.DiedSleptWithVictim]: $localize`:@@change-died-slept-with-victim:gestorben (War im haus des Ofers)`,
    [ChangeReason.TurnedIntoWolf]: $localize`:@@change-turned-into-wolf:verwandelt in Werewolf (NICHT SAGEN)`,
};