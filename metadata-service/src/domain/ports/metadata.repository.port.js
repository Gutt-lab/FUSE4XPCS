export class BaseRepositoryPort {
    async findAll() { throw new Error('Method not implemented'); }
}

export class UserRepositoryPort extends BaseRepositoryPort {
    async findByUserId(id) { throw new Error('Method not implemented'); }
}

export class ExperimentRepositoryPort extends BaseRepositoryPort {
    async findAllByUserId(userId) { throw new Error('Method not implemented'); }
    async findByExperimentId(experimentId) { throw new Error('Method not implemented'); }

}

export class DataInstanceRepositoryPort extends BaseRepositoryPort {
    async findByExperimentId(experimentId) { throw new Error('Method not implemented'); }
}

export class SampleRepositoryPort extends BaseRepositoryPort {
    async findByExperimentId(dataInstanceId) { throw new Error('Method not implemented'); }
}

export class DataFileRepositoryPort extends BaseRepositoryPort {
    async findByDataInstanceId(sampleId) { throw new Error('Method not implemented'); }
}

