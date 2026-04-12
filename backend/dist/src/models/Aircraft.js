export class Aircraft {
    tailNumber;
    model;
    capacity;
    constructor(tailNumber, model, capacity) {
        this.tailNumber = tailNumber;
        this.model = model;
        this.capacity = capacity;
    }
    getTailNumber() {
        return this.tailNumber;
    }
    getModel() {
        return this.model;
    }
    getCapacity() {
        return this.capacity;
    }
}
//# sourceMappingURL=Aircraft.js.map