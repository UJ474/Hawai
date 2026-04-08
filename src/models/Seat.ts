export enum SeatType {
  ECONOMY = "ECONOMY",
  PREMIUM_ECONOMY = "PREMIUM_ECONOMY",
  BUSINESS = "BUSINESS",
  FIRST_CLASS = "FIRST_CLASS",
}

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  OCCUPIED = "OCCUPIED",
}

export class Seat {
  private readonly seatNumber: string;
  private readonly type: SeatType;
  private status: SeatStatus;

  constructor(seatNumber: string, type: SeatType) {
    this.seatNumber = seatNumber;
    this.type = type;
    this.status = SeatStatus.AVAILABLE;
  }

  getSeatNumber(): string {
    return this.seatNumber;
  }

  getType(): SeatType {
    return this.type;
  }

  reserve(): void {
    if (this.status === SeatStatus.AVAILABLE) {
      this.status = SeatStatus.RESERVED;
    }
  }

  release(): void {
    this.status = SeatStatus.AVAILABLE;
  }

  isBooked(): boolean {
    return this.status !== SeatStatus.AVAILABLE;
  }
}
