class JobWorker {
    constructor(queue) {
        this.queue = queue;
    }

    processJob(job) {
        console.log(`Processing job: ${JSON.stringify(job)}`);
    }

    start() {
        this.queue.on('jobAdded', (job) => {
            this.processJob(job);
        });
    }
}

export default JobWorker;