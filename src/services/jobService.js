class JobService {
    constructor(queue) {
        this.queue = queue;
    }

    createJob(jobData) {
        if (jobData?.n === undefined || jobData?.n === null) {
            const err = new Error("'n' parametresi zorunludur");
            err.statusCode = 400;
            throw err;
        }
        return this.queue.addJob(jobData);
    }

    getJobs() {
        return this.queue.getAllJobs();
    }

    getJob(id) {
        const job = this.queue.getJob(Number(id));
        if (!job) {
            const err = new Error(`${id} ID'li iş bulunamadı`);
            err.statusCode = 404;
            throw err;
        }
        return job;
    }

    cancelJob(id) {
        return this.queue.cancelJob(Number(id));
    }
}

export default JobService;