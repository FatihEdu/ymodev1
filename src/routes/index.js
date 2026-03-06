import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Express Worker API is running' });
});

export default router;