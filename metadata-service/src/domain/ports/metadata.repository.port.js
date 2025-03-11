export class BaseRepositoryPort {
    async findAll() { throw new Error('Method not implemented'); }
    async findByUserId(id) { throw new Error('Method not implemented'); }
    async findById(id) { throw new Error('Method not implemented'); }
    async findLifeSpinById(id) { throw new Error('Method not implemented'); }
    async create(object) { throw new Error('Method not implemented'); }
    async delete(object_id, user_id) { throw new Error('Method not implemented'); }
    async update(object) { throw new Error('Method not implemented'); }
    async userRole(object_id, user_id) { throw new Error('Method not implemented'); }


}

export class UserRepositoryPort extends BaseRepositoryPort {
}

export class ExperimentRepositoryPort extends BaseRepositoryPort {
    async findLinkedSamplesByExperimentId(experimentId) { throw new Error('Method not implemented'); }
    async findLinkedDataInstancesByExperimentId(experimentId) { throw new Error('Method not implemented'); }
}

export class DataInstanceRepositoryPort extends BaseRepositoryPort {
    async findByExperimentId(experimentId) { throw new Error('Method not implemented'); }
}

export class SampleRepositoryPort extends BaseRepositoryPort {
    async findLinkedExperimentsBySampleId(sampleId) { throw new Error('Method not implemented'); }
    async findByExperimentId(experimentId) { throw new Error('Method not implemented'); }
}

export class DataFileRepositoryPort extends BaseRepositoryPort {
    async findByDataInstanceId(dataInstanceId) { throw new Error('Method not implemented'); }
}

