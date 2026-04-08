export class Passenger {
    private readonly id: string;
    private readonly name: string;
    private readonly email: string;

    constructor(name: string, email: string) {
        this.id = Math.random().toString(36).substring(2, 9);
        this.name = name;
        this.email = email;
    }

    getId() : string { return this.id; }

}