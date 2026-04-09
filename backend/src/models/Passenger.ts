export class Passenger {
  private passengerId: string;
  private name: string;
  private email: string;
  private phone: string;

  constructor(passengerId: string, name: string, email: string, phone: string) {
    this.passengerId = passengerId;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  // Getters
  public getPassengerId(): string { return this.passengerId; }
  public getName(): string { return this.name; }
  public getEmail(): string { return this.email; }
  public getPhone(): string { return this.phone; }
}
