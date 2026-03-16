export class Seat {
    private readonly seatNumber: string;
    private readonly type: SeatType;
    private status: SeatStatus;

    constructor(seatNumber: string, type: SeatType) {
        this.seatNumber = seatNumber;
        this.type = type;
        this.status = SeatStatus.AVAILABLE;
    }

    getSeatNumber() : string {
        return this.seatNumber;
    }   

    reserve() : void {
        if (this.status === SeatStatus.AVAILABLE) {     
            this.status = SeatStatus.RESERVED;
        }
    }

    release() : void {
        this.status = SeatStatus.AVAILABLE;
    }

    isBooked() : boolean {
        return this.status !== SeatStatus.AVAILABLE;
    }
}


enum SeatType {
    ECONOMY,
    PREMIUM_ECONOMY,
    BUSINESS,
    FIRST_CLASS
}

enum SeatStatus {
    AVAILABLE,
    RESERVED,
    OCCUPIED
}