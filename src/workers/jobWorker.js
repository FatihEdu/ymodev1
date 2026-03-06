import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRIME_TEST_WORKER = join(__dirname, 'primeTestWorker.js');

const TIMEOUT_MS = 30_000; // Her test için ayrı ayrı uygulanır. Aşılırsa thread terminate edilir.

class JobWorker {
    constructor(id, queue) {
        this.id = id;
        this.queue = queue;
        this.busy = false;
    }

    start() {
        // Yeni iş geldiğinde boştaysak hemen al
        this.queue.on('jobAdded', () => this._tryProcess());
    }

    _tryProcess() {
        if (this.busy) return;
        const job = this.queue.claimNextPending();
        if (!job) return;

        this.busy = true;
        this._process(job).finally(() => {
            this.busy = false;
            // Bittikten sonra bekleyen iş var mı kontrol et
            this._tryProcess();
        });
    }

    async _process(job) {
        const n = job.data?.n;
        console.log(`[Worker ${this.id}] İş başladı → id:${job.id}, n:${n}`);

        // Önce doğrulama — geçersizse testleri hiç başlatma
        try {
            this._validate(n);
        } catch (err) {
            this.queue.updateJob(job.id, { status: 'failed', error: err.message });
            console.log(`[Worker ${this.id}] Doğrulama hatası → id:${job.id}: ${err.message}`);
            return;
        }

        // Tüm testler paralel başlar — her biri ayrı worker thread'de çalışır
        await Promise.all([
            this._runTest(job, 'millerRabin',   n),
            this._runTest(job, 'fermat',        n),
            this._runTest(job, 'trialDivision', n),
        ]);

        // Herhangi bir test başarısız olduysa job'u 'failed' olarak işaretle
        const failedTests = Object.entries(job.tests)
            .filter(([, result]) => result.status === 'failed')
            .map(([name]) => name);

        if (failedTests.length > 0) {
            this.queue.updateJob(job.id, {
                status: 'failed',
                error: `Başarısız testler: ${failedTests.join(', ')}`,
            });
            console.log(`[Worker ${this.id}] Başarısız → id:${job.id}, başarısız testler: ${failedTests.join(', ')}`);
        } else {
            this.queue.updateJob(job.id, { status: 'completed' });
            console.log(`[Worker ${this.id}] Tamamlandı → id:${job.id}`);
        }
    }

    /**
     * Tek bir testi ayrı bir worker thread'de çalıştırır.
     * Thread, TIMEOUT_MS aşılırsa terminate edilir — main thread hiç bloklanmaz.
     * Her durumda (hata, timeout, başarı) resolve eder — job'u asla durdurmaz.
     */
    _runTest(job, testName, n) {
        const startTime = new Date().toISOString();
        const startMs = Date.now();

        this.queue.updateTestResult(job.id, testName, {
            status: 'running',
            startTime,
            endTime: null,
            elapsedMs: null,
            verdict: null,
            error: null,
        });

        return new Promise((resolve) => {
            const worker = new Worker(PRIME_TEST_WORKER, { workerData: { testName, n } });

            const done = (updates) => {
                this.queue.updateTestResult(job.id, testName, {
                    ...updates,
                    startTime,
                    endTime: new Date().toISOString(),
                    elapsedMs: Date.now() - startMs,
                });
                resolve();
            };

            const timeoutId = setTimeout(() => {
                worker.terminate();
                done({ status: 'failed', verdict: null, error: `Zaman aşımı (${TIMEOUT_MS / 1000}s)` });
            }, TIMEOUT_MS);

            worker.on('message', ({ verdict, error }) => {
                clearTimeout(timeoutId);
                done({
                    status: error ? 'failed' : 'completed',
                    verdict,
                    error,
                });
            });

            worker.on('error', (err) => {
                clearTimeout(timeoutId);
                done({ status: 'failed', verdict: null, error: err.message });
            });
        });
    }

    _validate(n) {
        if (n === undefined || n === null)
            throw new Error('n parametresi zorunludur');
        if (typeof n !== 'number')
            throw new Error(`n parametresi Number tipinde olmalıdır (gelen: ${typeof n})`);
        if (Number.isNaN(n))
            throw new Error('n parametresi NaN olamaz');
        if (!Number.isInteger(n))
            throw new Error('n parametresi tam sayı olmalıdır');
        if (n < 2)
            throw new Error(`n parametresi 2'den küçük olamaz (gelen: ${n})`);
        if (n > Number.MAX_SAFE_INTEGER)
            throw new Error(`n parametresi ${Number.MAX_SAFE_INTEGER} değerinden büyük olamaz`);
    }
}

export default JobWorker;