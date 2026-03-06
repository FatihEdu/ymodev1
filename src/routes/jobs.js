import { Router } from 'express';
import JobController from '../controllers/jobController.js';
import JobService from '../services/jobService.js';
import Queue from '../utils/queue.js';
import WorkerPool from '../workers/workerPool.js';

const router = Router();

const GLOBAL_QUEUE_KEY = '__JOBS_QUEUE__';
const GLOBAL_WORKER_POOL_KEY = '__JOBS_WORKER_POOL__';

const globalObject = globalThis;

if (!globalObject[GLOBAL_QUEUE_KEY]) {
  const queueInstance = new Queue();
  const workerPoolInstance = new WorkerPool(queueInstance, 3);
  workerPoolInstance.start();

  globalObject[GLOBAL_QUEUE_KEY] = queueInstance;
  globalObject[GLOBAL_WORKER_POOL_KEY] = workerPoolInstance;
}

const queue = globalObject[GLOBAL_QUEUE_KEY];
const jobService = new JobService(queue);
const jobController = new JobController(jobService);

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Asal sayı kontrol işleri
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Yeni bir asal sayı kontrol işi oluştur
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - n
 *             properties:
 *               n:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 9007199254740991
 *                 description: Asal sayı kontrolü yapılacak tam sayı
 *                 example: 104729
 *     responses:
 *       202:
 *         description: İş kuyruğa alındı (status=pending)
 *       400:
 *         description: n parametresi eksik
 */
router.post('/', jobController.createJob.bind(jobController));

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Tüm işleri listele
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: İş listesi
 */
router.get('/', jobController.getJobs.bind(jobController));

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Belirli bir işi getir
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: İş ID'si
 *     responses:
 *       200:
 *         description: İş detayı
 *       404:
 *         description: İş bulunamadı
 */
router.get('/:id', jobController.getJob.bind(jobController));

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Bekleyen (pending) bir işi iptal et
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: İş ID'si
 *     responses:
 *       200:
 *         description: İş iptal edildi (status=cancelled)
 *       404:
 *         description: İş bulunamadı
 *       409:
 *         description: İş işleniyor veya zaten tamamlandı/iptal edildi
 */
router.delete('/:id', jobController.cancelJob.bind(jobController));

export default router;