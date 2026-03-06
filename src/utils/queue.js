class Queue {
    constructor() {
        this.jobs = [];
    }

    addJob(job) {
        this.jobs.push(job);
    }

    getAllJobs() {
        return this.jobs;
    }

    processJobs(worker) {
        while (this.jobs.length > 0) {
            const job = this.jobs.shift();
            worker.processJob(job);
        }
    }
}

export default Queue;