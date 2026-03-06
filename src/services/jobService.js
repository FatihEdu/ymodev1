class JobService {
    constructor(queue) {
        this.queue = queue;
    }

    createJob(jobData) {
        this.queue.addJob(jobData);
        return { status: 'Job created successfully', data: jobData };
    }

    getJobs() {
        return this.queue.getAllJobs();
    }
}

export default JobService;