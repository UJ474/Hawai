export enum SeatType {
  ECONOMY = "ECONOMY",
  BUSINESS = "BUSINESS",
  FIRST_CLASS = "FIRST_CLASS",
}

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
}

export class Seat {
  private seatId: string;
  private seatNumber: string;
  private seatType: SeatType;
  private status: SeatStatus;
  private flightId: string;

  constructor(
    seatId: string,
    seatNumber: string,
    seatType: SeatType,
    flightId: string,
    status: SeatStatus = SeatStatus.AVAILABLE
  ) {
    this.seatId = seatId;
    this.seatNumber = seatNumber;
    this.seatType = seatType;
    this.flightId = flightId;
    this.status = status;
  }

  public book(): void {
    if (this.status === SeatStatus.AVAILABLE) {
      this.status = SeatStatus.BOOKED;
    }
  }

  public release(): void {
    if (this.status === SeatStatus.BOOKED) {
      this.status = SeatStatus.AVAILABLE;
    }
  }

  public getSeatId(): string { return this.seatId; }
  public getSeatNumber(): string { return this.seatNumber; }
  public getSeatType(): SeatType { return this.seatType; }
  public getStatus(): SeatStatus { return this.status; }
  public getFlightId(): string { return this.flightId; }
}
