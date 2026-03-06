class JobController {
    constructor(jobService) {
        this.jobService = jobService;
    }

    createJob(req, res) {
        try {
            const job = this.jobService.createJob(req.body);
            res.status(202).json(job);
        } catch (error) {
            res.status(error.statusCode ?? 500).json({ message: error.message });
        }
    }

    getJobs(req, res) {
        try {
            res.status(200).json(this.jobService.getJobs());
        } catch (error) {
            res.status(error.statusCode ?? 500).json({ message: error.message });
        }
    }

    getJob(req, res) {
        try {
            res.status(200).json(this.jobService.getJob(req.params.id));
        } catch (error) {
            res.status(error.statusCode ?? 500).json({ message: error.message });
        }
    }

    cancelJob(req, res) {
        try {
            res.status(200).json(this.jobService.cancelJob(req.params.id));
        } catch (error) {
            res.status(error.statusCode ?? 500).json({ message: error.message });
        }
    }
}

export default JobController;