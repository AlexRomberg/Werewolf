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

    public get Id(): string { return this.id; }

    public get Name(): string { return this.name; }
    public set Name(value: string) { this.name = value; }

    public get Character(): Character | undefined { return this.character; }
    public set Character(value: Character | undefined) { this.character = value; }

    public get IsProtected() { return this.isProtected; }
    public set IsProtected(value: boolean) { this.isProtected = value; }

    public get IsVictim() { return this.isVictim; }
    public set IsVictim(value: boolean) { this.isVictim = value; }

    public get IsEnchanted() { return this.isEnchanted; }
    public set IsEnchanted(value: boolean) { this.isEnchanted = value; }

    public get IsWerewolf() { return this.isWerewolf; }
    public set IsWerewolf(value: boolean) { this.isWerewolf = value; }

    public get IsDead() { return this.isDead; }
    public set IsDead(value: boolean) { this.isDead = value; }

    public resetPerson() {
        this.isProtected = false;
        this.isVictim = false;
        this.isEnchanted = false;
        this.isWerewolf = false;
        this.isDead = false;
        this.character = undefined;
    }

    public cloneWithoutEffectState(): Person {
        const person = new Person();
        person.id = this.id;
        person.name = this.name;
        person.character = this.character;
        return person;
    }
}