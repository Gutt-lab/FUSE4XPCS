export class SampleMetadataController {
    constructor(sampleService) {
        this.sampleService = sampleService;
    }

    async getAllSamples(req, res, next) {
        try {
            const samples = await this.sampleService.findAll();
            res.json(samples);
        } catch (error) {
            next(error);
        }
    }

    async getAllSamplesByUserId(req, res, next) {
        try {
            const samples = await this.sampleService.findAllByUserId(req.params.id);
            if (!samples) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(sample);
        } catch (error) {
            next(error);
        }
    }

    async getSampleById(req, res, next) {
        try {
            const sample = await this.sampleService.findByExperimentId(req.params.id);
            if (!sample) {
                return res.status(404).json({ message: 'sample not found' });
            }
            res.json(sample);
        } catch (error) {
            next(error);
        }
    }
} 