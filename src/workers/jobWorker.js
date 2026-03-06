class JobWorker {
    constructor(queue) {
        this.queue = queue;
    }

    processJob(job) {
        console.log(`İş işleniyor: ${JSON.stringify(job)}`);
        // Buraya asıl iş işleme mantığını ekleyeceğiz. Yani, asal sayı testi.
    }

    start() {
        this.queue.on('jobAdded', (job) => {
            this.processJob(job);
        });
    }
}

export default JobWorker;