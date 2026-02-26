import express from 'express';
import cors from 'cors';
import formRoutes from './routes/forms.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/forms', formRoutes);

app.use(errorHandler);

export default app;
