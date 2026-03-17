export class Passenger {
    private readonly id: string;
    private readonly name: string;
    private readonly email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }

    getId() : string {}

}