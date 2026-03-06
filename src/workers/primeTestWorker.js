/**
 * Bu dosya doğrudan çalıştırılmaz.
 * jobWorker.js tarafından her test için ayrı bir worker_thread olarak spawn edilir.
 * workerData: { testName: string, n: number }
 */
import { workerData, parentPort } from 'node:worker_threads';
import { isPrime, fermatTest, trialDivision } from '../utils/primeUtils.js';

const { testName, n } = workerData;

const TEST_FNS = {
    millerRabin:   (n) => isPrime(n),
    fermat:        (n) => fermatTest(n, 10),
    trialDivision: (n) => trialDivision(n),
};

try {
    const fn = TEST_FNS[testName];
    if (!fn) throw new Error(`Bilinmeyen test: ${testName}`);
    const verdict = fn(n);
    parentPort.postMessage({ verdict, error: null });
} catch (err) {
    parentPort.postMessage({ verdict: null, error: err.message });
}
