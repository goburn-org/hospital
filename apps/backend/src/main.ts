import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { setUserContext } from './middleware/auth-middleware';
import { errorMiddleware } from './middleware/error-middleware';
import { apiLoggerMiddleware } from './middleware/logger-middleware';
import { QueueParam, queueService } from './queue';
import Routes from './route';

const MAX_FILE_SIZE = 1024 * 1024 * 50; // 50MB

const app = express();
app.use(cors());
app.use(express.json());
app.use(apiLoggerMiddleware);
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
app.use(multerMid.single('file'));
app.use(setUserContext);

app.get('/', (req, res) => {
  res.send('ready');
});

app.use('/api', Routes);
app.use(errorMiddleware);

queueService.queue.process((job) => {
  const data = job.data as QueueParam;
});
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});
