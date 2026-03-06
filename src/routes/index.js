import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ status: 'tamam', message: 'Express Jobs ile Asal Sayı Testleri API çalışıyor.' });
});

export default router;
