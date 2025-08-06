import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import User from './models/user.model';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the React API Server!');
});

app.get('/api/data', (req: Request, res: Response) => {
  res.json({ message: 'This is some sample data.' });
});

app.post('/api/data', (req: Request, res: Response) => {
  const data = req.body;
  res.status(201).json({ message: 'Data received successfully.', data });
});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await User.sequelize?.authenticate();
  console.log('Database connected');
});

