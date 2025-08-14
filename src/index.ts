import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import jwt from 'jsonwebtoken';
import User from './models/user.model';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Config ---
const JWT_SECRET = process.env.JWT_SECRET || 'random-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// For demo only. In production, validate against DB + hashed password.
const BASIC_AUTH_USERS = {
  [process.env.BASIC_AUTH_USER || 'admin']: process.env.BASIC_AUTH_PASS || 'supersecret',
};

app.use(cors());
app.use(bodyParser.json());

// --- JWT helpers ---
type JwtPayload = { sub: string; name?: string; role?: string };
const options = { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN }

function signToken(payload: JwtPayload) {
  return jwt.sign(payload as string | object , JWT_SECRET as jwt.Secret | jwt.PrivateKey, options as jwt.SignOptions); 
}

function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header (expected: Bearer <token>)' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // attach to request (TypeScript: use any or extend Request type)
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// --- Public routes ---
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the React API Server!');
});

// --- Login (Basic Auth -> JWT) ---
/**
 * Flow:
 *  - Client sends Authorization: Basic <base64 user:pass>
 *  - If valid, we mint a JWT and return it.
 */
app.post(
  '/login',
  basicAuth({
    users: BASIC_AUTH_USERS,
    challenge: true, // sends WWW-Authenticate header on 401
    authorizeAsync: false,
  }),
  async (req: Request, res: Response) => {
    // At this point, Basic Auth has already validated credentials.
    // You can look up the user in DB here if you want richer claims.
    const creds = (req as any).auth; // provided by express-basic-auth
    const username = creds?.user || 'unknown';

    // Example JWT claims; adjust to your needs:
    const token = signToken({
      sub: username,
      name: username,
      role: 'user',
    });

    res.json({ token, token_type: 'Bearer', expires_in: JWT_EXPIRES_IN });
  }
);

// --- Example: a public endpoint (no token required) ---
app.get('/api/data', (req: Request, res: Response) => {
  res.json({ message: 'This is some sample data.' });
});

// --- Example: protected endpoints (token required) ---
app.post('/api/data', verifyJwt, (req: Request, res: Response) => {
  const data = req.body;
  res.status(201).json({
    message: 'Data received successfully.',
    data,
    user: (req as any).user, // who sent it
  });
});

// Protect users endpoints (adjust as you prefer)
app.get('/users', verifyJwt, async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.put('/users/:id', verifyJwt, async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname } = req.body;
  const user = await User.findByPk(id);

  if (user) {
    user.firstname = firstname;
    user.lastname = lastname;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await User.sequelize?.authenticate();
  console.log('Database connected');
});
