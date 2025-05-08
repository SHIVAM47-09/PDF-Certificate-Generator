import express from 'express';
const router = express.Router();
import { generatePdf } from '../controller/pdfGenerator.js';

router.post('/api/generatePdf', generatePdf)

export default router;