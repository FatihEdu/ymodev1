import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Express Jobs ile Asal Sayı Testleri API çalışıyor.' });
});

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;

