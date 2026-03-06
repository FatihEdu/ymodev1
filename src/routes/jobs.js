import { Router } from 'express';
import JobController from '../controllers/jobController.js';
import JobService from '../services/jobService.js';
import Queue from '../utils/queue.js';

const router = Router();
const jobService = new JobService(new Queue());
const jobController = new JobController(jobService);

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management operations
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', jobController.createJob.bind(jobController));

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Retrieve all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get('/', jobController.getJobs.bind(jobController));

export default router;