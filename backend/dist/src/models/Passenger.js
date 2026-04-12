export class Passenger {
    passengerId;
    name;
    email;
    phone;
    constructor(passengerId, name, email, phone) {
        this.passengerId = passengerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    // Getters
    getPassengerId() { return this.passengerId; }
    getName() { return this.name; }
    getEmail() { return this.email; }
    getPhone() { return this.phone; }
}
//# sourceMappingURL=Passenger.js.map