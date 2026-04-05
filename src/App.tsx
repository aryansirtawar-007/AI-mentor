import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './lib/api';

import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CareerForm from './pages/CareerForm';
import Chat from './pages/Chat';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        await api.auth.me();
        setAuthenticated(true);
      } catch (e) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  return authenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen text-slate-50 selection:bg-neon-purple/30">
        <ThreeBackground />
        <Navbar />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/analyze" element={
              <PrivateRoute>
                <CareerForm />
              </PrivateRoute>
            } />
            
            <Route path="/chat" element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } />
          </Routes>
        </main>

        <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="font-display font-bold text-lg">CareerAI</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2026 AI Career Mentor. Powered by Google Gemini.
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
