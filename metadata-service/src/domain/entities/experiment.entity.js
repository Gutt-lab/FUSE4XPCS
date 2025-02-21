export class Experiment {
    constructor(ownerId, name, facilityId, startDate, endDate) {
        this.ownerId = ownerId;
        this.name = name;
        this.facilityId = facilityId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Optional: Add validation methods
    validate() {
        if (!this.ownerId) {
            throw new Error('Owner ID is required');
        }
        if (!this.name) {
            throw new Error('Experiment name is required');
        }
        if (!this.facilityId) {
            throw new Error('Facility ID is required');
        }
        if (!this.startDate) {
            throw new Error('Start date is required');
        }
        if (!this.endDate) {
            throw new Error('End date is required');
        }
    }
} 