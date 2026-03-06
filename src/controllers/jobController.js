class JobController {
    constructor(jobService) {
        this.jobService = jobService;
    }

    async createJob(req, res) {
        try {
            const jobData = req.body;
            const job = await this.jobService.createJob(jobData);
            res.status(201).json(job);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getJobs(req, res) {
        try {
            const jobs = await this.jobService.getJobs();
            res.status(200).json(jobs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default JobController;