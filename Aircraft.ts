export class Aircraft {
    private readonly tailNumber: string;
    private readonly model: string;
    private readonly capacity: number;

    constructor(tailNumber: string, model: string, capacity: number) {
        this.tailNumber = tailNumber;
        this.model = model;
        this.capacity = capacity;
    }

    getTailNumber(): string {
        return this.tailNumber;
    }

    getModel(): string {
        return this.model;
    }

    getCapacity(): number {
        return this.capacity;
    }
}