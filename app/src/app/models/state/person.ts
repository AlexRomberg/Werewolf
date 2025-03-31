import { v4 } from "uuid";
import { Character } from "../characters/character";

export class Person {
    private id = v4();
    private name = "";
    private isProtected = false;
    private isVictim = false;
    private isEnchanted = false;
    private isWerewolf = false;
    private isDead = false;
    private character?: Character;

    get Id(): string { return this.id; }

    get Name(): string { return this.name; }
    set Name(value: string) {
        this.name = value;
        this.onChanged();
    }

    get Character(): Character | undefined { return this.character; }
    set Character(value: Character | undefined) {
        this.character = value;
        this.onChanged();
    }

    get IsProtected() { return this.isProtected; }
    set IsProtected(value: boolean) {
        this.isProtected = value;
        this.onChanged();
    }

    get IsVictim() { return this.isVictim; }
    set IsVictim(value: boolean) {
        this.isVictim = value;
        this.onChanged();
    }

    get IsEnchanted() { return this.isEnchanted; }
    set IsEnchanted(value: boolean) {
        this.isEnchanted = value;
        this.onChanged();
    }

    get IsWerewolf() { return this.isWerewolf; }
    set IsWerewolf(value: boolean) {
        this.isWerewolf = value;
        this.onChanged();
    }

    get IsDead() { return this.isDead; }
    set IsDead(value: boolean) {
        this.isDead = value;
        this.onChanged();
    }

    constructor(private onChanged = () => { }) { }

    resetPerson() {
        this.isProtected = false;
        this.isVictim = false;
        this.isEnchanted = false;
        this.isWerewolf = false;
        this.isDead = false;
        this.character = undefined;
    }

    cloneWithoutEffectState(): Person {
        const person = new Person();
        person.id = this.id;
        person.name = this.name;
        person.character = this.character;
        return person;
    }

    asSerializeable() {
        return {
            id: this.id,
            name: this.name,
            isProtected: this.isProtected,
            isVictim: this.isVictim,
            isEnchanted: this.isEnchanted,
            isWerewolf: this.isWerewolf,
            isDead: this.isDead,
            character: this.character?.Id
        };
    }

    static fromSerializeable(data: {
        id: string,
        name: string,
        isProtected: boolean,
        isVictim: boolean,
        isEnchanted: boolean,
        isWerewolf: boolean,
        isDead: boolean,
        character: Character | undefined
    }, onChanged = () => { }): Person {
        const person = new Person(onChanged);
        person.id = data.id ?? v4();
        person.name = data.name ?? "";
        person.isProtected = data.isProtected ?? false;
        person.isVictim = data.isVictim ?? false;
        person.isEnchanted = data.isEnchanted ?? false;
        person.isWerewolf = data.isWerewolf ?? false;
        person.isDead = data.isDead ?? false;
        person.character = data.character ?? undefined;
        return person;
    }
}