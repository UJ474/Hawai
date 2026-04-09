export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  EXPIRED = "EXPIRED",
}

export class Booking {
  private bookingId: string;
  private flightId: string;
  private passengerId: string;
  private seatId: string;
  private status: BookingStatus;

  constructor(
    bookingId: string,
    flightId: string,
    passengerId: string,
    seatId: string,
    status: BookingStatus
  ) {
    this.bookingId = bookingId;
    this.flightId = flightId;
    this.passengerId = passengerId;
    this.seatId = seatId;
    this.status = status;
  }

  public confirmBooking(): void {
    this.status = BookingStatus.CONFIRMED;
  }

  public cancelBooking(): void {
    this.status = BookingStatus.CANCELED;
  }

  // Getters
  public getBookingId(): string { return this.bookingId; }
  public getFlightId(): string { return this.flightId; }
  public getPassengerId(): string { return this.passengerId; }
  public getSeatId(): string { return this.seatId; }
  public getStatus(): BookingStatus { return this.status; }
}
