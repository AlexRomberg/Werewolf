export interface CirclePerson {
    name: string | undefined;
    protected: boolean;
}

export interface CircleConnection {
    type: CircleConnectionTypes;
    from: number;
    to: number;
}

export enum CircleConnectionTypes {
    Love,
    Trust,
    Sleepover,
}

export interface Action {
    title: string;
    points: string[];
    buttons: {
        title: string
        action: () => void
    }[],
    onNext?: () => void
}