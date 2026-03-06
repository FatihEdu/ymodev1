import { EventEmitter } from 'node:events';

let nextId = 1;

class Queue extends EventEmitter {
    constructor() {
        super();
        // Map<id, job> — ekleme sırasını korur
        this.jobs = new Map();
    }

    addJob(data) {
        const emptyTest = () => ({
            status: 'pending',
            startTime: null,
            endTime: null,
            elapsedMs: null,
            verdict: null,
            error: null,
        });

        const job = {
            id: nextId++,
            data,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            error: null,
            tests: {
                millerRabin: emptyTest(),
                fermat: emptyTest(),
                trialDivision: emptyTest(),
            },
        };
        this.jobs.set(job.id, job);
        this.emit('jobAdded', job);
        return job;
    }

    /**
     * İlk pending işi atomik olarak 'processing' yap ve döndür.
     * JS single-thread olduğundan bu işlem race condition içermez.
     */
    claimNextPending() {
        for (const job of this.jobs.values()) {
            if (job.status === 'pending') {
                job.status = 'processing';
                job.updatedAt = new Date().toISOString();
                return job;
            }
        }
        return null;
    }

    updateJob(id, updates) {
        const job = this.jobs.get(id);
        if (!job) return null;
        Object.assign(job, updates, { updatedAt: new Date().toISOString() });
        return job;
    }

    updateTestResult(id, testName, result) {
        const job = this.jobs.get(id);
        if (!job) return null;
        job.tests[testName] = result;
        job.updatedAt = new Date().toISOString();
        return job;
    }

    /**
     * Sadece 'pending' durumdaki işler iptal edilebilir.
     * 'processing' durumdakiler iptal edilemez.
     */
    cancelJob(id) {
        const job = this.jobs.get(id);
        if (!job) {
            const err = new Error(`${id} ID'li iş bulunamadı`);
            err.statusCode = 404;
            throw err;
        }
        if (job.status === 'processing') {
            const err = new Error('İşlenmekte olan bir iş iptal edilemez');
            err.statusCode = 409;
            throw err;
        }
        if (job.status !== 'pending') {
            const err = new Error(`İş zaten '${job.status}' durumunda, iptal edilemez`);
            err.statusCode = 409;
            throw err;
        }
        job.status = 'cancelled';
        job.updatedAt = new Date().toISOString();
        return job;
    }

    getAllJobs() {
        return Array.from(this.jobs.values());
    }

    getJob(id) {
        return this.jobs.get(id) ?? null;
    }
}

export default Queue;