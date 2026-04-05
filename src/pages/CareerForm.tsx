import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, Send, Clock, Target, Rocket, ChevronRight, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

export default function CareerForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interests: '',
    skills: '',
    goals: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const analysis = await api.career.analyze(formData);
      setResult(analysis);
      setStep(5); // Result step
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "What are your interests?",
      description: "Tell us what you're passionate about.",
      field: "interests",
      placeholder: "e.g., Creative writing, solving complex problems, building apps...",
      icon: Sparkles
    },
    {
      id: 2,
      title: "What are your current skills?",
      description: "List what you're already good at.",
      field: "skills",
      placeholder: "e.g., Python, Graphic Design, Project Management...",
      icon: Brain
    },
    {
      id: 3,
      title: "What are your career goals?",
      description: "Where do you see yourself in 5 years?",
      field: "goals",
      placeholder: "e.g., Become a Senior Software Engineer at a top tech firm...",
      icon: Target
    },
    {
      id: 4,
      title: "Time Availability",
      description: "How much time can you dedicate to learning?",
      field: "time",
      placeholder: "e.g., 10 hours per week, Full-time study...",
      icon: Clock
    }
  ];

  const currentStep = steps.find(s => s.id === step);

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step <= 4 ? (
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="glass-dark p-8 md:p-12 rounded-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center">
                {currentStep && <currentStep.icon className="w-6 h-6 text-neon-purple" />}
              </div>
              <div>
                <div className="text-xs font-bold text-neon-purple uppercase tracking-widest mb-1">
                  Step {step} of 4
                </div>
                <h2 className="text-2xl font-display font-bold">{currentStep?.title}</h2>
              </div>
            </div>

            <p className="text-slate-400 mb-8">{currentStep?.description}</p>

            <textarea
              value={(formData as any)[currentStep?.field || '']}
              onChange={(e) => handleInputChange(currentStep?.field || '', e.target.value)}
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all resize-none mb-8"
              placeholder={currentStep?.placeholder}
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-6 py-3 rounded-xl glass text-sm font-bold disabled:opacity-30"
              >
                Back
              </button>
              
              {step < 4 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!(formData as any)[currentStep?.field || '']}
                  className="px-8 py-3 rounded-xl bg-neon-purple text-white font-bold shadow-lg hover:shadow-neon-purple/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.time}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold shadow-lg hover:shadow-neon-purple/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Generate My Roadmap'}
                  {!loading && <Rocket className="w-5 h-5" />}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-8"
          >
            <div className="glass-dark p-8 rounded-3xl border-l-4 border-neon-blue">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-neon-blue" />
                </div>
                <h2 className="text-3xl font-display font-bold">Your AI Career Analysis</h2>
              </div>
              <p className="text-slate-400">{result?.marketOutlook}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-dark p-8 rounded-3xl">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-neon-pink" />
                  Suggested Roles
                </h3>
                <div className="space-y-4">
                  {result?.suggestedRoles?.map((role: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">{role.title}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-neon-blue/10 text-neon-blue">
                          {role.matchPercentage}% Match
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{role.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-dark p-8 rounded-3xl">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-neon-purple" />
                  Required Skills
                </h3>
                <div className="space-y-4">
                  {result?.requiredSkills?.map((skill: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5">
                      <div className={`mt-1 w-2 h-2 rounded-full ${
                        skill.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{skill.skill}</div>
                        <p className="text-xs text-slate-400">{skill.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-dark p-8 rounded-3xl">
              <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-neon-blue" />
                Step-by-Step Roadmap
              </h3>
              <div className="space-y-12 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/10" />
                {result?.roadmap?.map((phase: any, idx: number) => (
                  <div key={idx} className="relative pl-12">
                    <div className="absolute left-2 top-0 w-4.5 h-4.5 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(157,80,187,0.5)] -translate-x-1/2" />
                    <div className="mb-2">
                      <span className="text-xs font-bold text-neon-purple uppercase tracking-widest">{phase.duration}</span>
                      <h4 className="text-xl font-display font-bold">{phase.phase}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {phase.tasks?.map((task: string, tIdx: number) => (
                        <div key={tIdx} className="flex items-center gap-2 text-sm text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-slate-600" />
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 rounded-2xl glass font-bold hover:bg-white/20 transition-all"
              >
                Generate New Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
