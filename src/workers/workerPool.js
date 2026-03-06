import JobWorker from './jobWorker.js';

class WorkerPool {
    constructor(queue, size = 3) {
        this.workers = Array.from(
            { length: size },
            (_, i) => new JobWorker(i + 1, queue)
        );
    }

    start() {
        this.workers.forEach(worker => worker.start());
        console.log(`[WorkerPool] ${this.workers.length} worker başlatıldı.`);
    }
}

export default WorkerPool;
