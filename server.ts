import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'career-mentor-secret-key';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "" });
const model = "gemini-3-flash-preview";

// Database helper
async function getDb() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    const initialDb = { users: [], careerPlans: {}, chats: {} };
    await fs.writeFile(DB_FILE, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
}

async function saveDb(db: any) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- Auth Routes ---
  app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const db = await getDb();
    
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, createdAt: new Date().toISOString() };
    db.users.push(newUser);
    await saveDb(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, name, email } });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await getDb();
    const user = db.users.find((u: any) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email } });
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    const db = await getDb();
    const user = db.users.find((u: any) => u.id === req.user.id);
    if (!user) return res.sendStatus(404);
    res.json({ id: user.id, name: user.name, email: user.email });
  });

  // --- Career Routes ---
  app.post('/api/career/analyze', authenticateToken, async (req: any, res) => {
    const { interests, skills, goals, time } = req.body;
    
    const prompt = `
      As an expert AI Career Mentor, analyze the following user profile and provide a detailed career guidance report in JSON format.
      
      User Profile:
      - Interests: ${interests}
      - Current Skills: ${skills}
      - Career Goals: ${goals}
      - Time Availability: ${time}
      
      The response MUST be a valid JSON object with the following structure:
      {
        "suggestedRoles": [
          {
            "title": "Role Name",
            "matchPercentage": 95,
            "reason": "Why this role fits"
          }
        ],
        "requiredSkills": [
          {
            "skill": "Skill Name",
            "priority": "High/Medium/Low",
            "description": "Why it's needed"
          }
        ],
        "roadmap": [
          {
            "phase": "Phase Name",
            "duration": "Estimated time",
            "tasks": ["Task 1", "Task 2"]
          }
        ],
        "marketOutlook": "Brief overview of the industry trends for these roles"
      }
    `;

    try {
      const result = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const analysis = JSON.parse(result.text || "{}");
      
      const db = await getDb();
      db.careerPlans[req.user.id] = { ...analysis, updatedAt: new Date().toISOString() };
      await saveDb(db);

      res.json(analysis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'AI Analysis failed' });
    }
  });

  app.get('/api/career/plan', authenticateToken, async (req: any, res) => {
    const db = await getDb();
    res.json(db.careerPlans[req.user.id] || null);
  });

  // --- Chat Routes ---
  app.post('/api/chat', authenticateToken, async (req: any, res) => {
    const { message } = req.body;
    const db = await getDb();
    
    if (!db.chats[req.user.id]) db.chats[req.user.id] = [];
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: "You are an expert AI Career Mentor. You are helpful, encouraging, and provide practical, data-driven career advice.",
      },
    });

    try {
      const response = await chat.sendMessage({ message });
      const aiResponse = response.text;

      const userMsg = { role: 'user', text: message, createdAt: new Date().toISOString() };
      const aiMsg = { role: 'model', text: aiResponse, createdAt: new Date().toISOString() };
      
      db.chats[req.user.id].push(userMsg, aiMsg);
      await saveDb(db);

      res.json({ text: aiResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Chat failed' });
    }
  });

  app.get('/api/chat/history', authenticateToken, async (req: any, res) => {
    const db = await getDb();
    res.json(db.chats[req.user.id] || []);
  });

  app.delete('/api/chat/history', authenticateToken, async (req: any, res) => {
    const db = await getDb();
    db.chats[req.user.id] = [];
    await saveDb(db);
    res.json({ message: 'Chat history cleared' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
