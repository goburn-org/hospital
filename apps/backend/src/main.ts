import express from 'express';
import cors from 'cors';
import Routes from './route';
import { apiLoggerMiddleware } from './middleware/logger-middleware';
import multer from 'multer';
import { errorMiddleware } from './middleware/error-middleware';

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

app.get('/', (req, res) => {
  res.send('ready');
});

app.use('/api', Routes);
app.use(errorMiddleware);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});
