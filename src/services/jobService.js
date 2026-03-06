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

        const n = Number(jobData.n);
        if (!Number.isFinite(n) || !Number.isInteger(n)) {
            const err = new Error("'n' parametresi geçerli bir tamsayı olmalıdır");
            err.statusCode = 400;
            throw err;
        }

        jobData.n = n;
        return this.queue.addJob(jobData);
    }

    getJobs() {
        return this.queue.getAllJobs();
    }

    _parseId(id) {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId)) {
            const err = new Error(`Geçersiz ID: '${id}' bir tam sayı olmalıdır`);
            err.statusCode = 400;
            throw err;
        }
        return parsedId;
    }

    getJob(id) {
        const parsedId = this._parseId(id);
        const job = this.queue.getJob(parsedId);
        if (!job) {
            const err = new Error(`${parsedId} ID'li iş bulunamadı`);
            err.statusCode = 404;
            throw err;
        }
        return job;
    }

    cancelJob(id) {
        return this.queue.cancelJob(this._parseId(id));
    }
}

export default JobService;