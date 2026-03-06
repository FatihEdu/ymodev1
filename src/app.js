import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger.js';
import indexRoutes from './routes/index.js';
import jobRoutes from './routes/jobs.js';

const app = express();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/', indexRoutes);
app.use('/jobs', jobRoutes);

export default app;